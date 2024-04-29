// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
#nullable disable

using System;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using CS451_Team_Project.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using Google.Authenticator;
using CS451_Team_Project.Controllers;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


namespace CS451_Team_Project.Areas.Identity.Pages.Account
{
    public class ForgotPasswordModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _dbContext;
        private readonly ILogger<EmailController> _logger;

        public ForgotPasswordModel(ILogger<EmailController> logger, UserManager<ApplicationUser> userManager, AppDbContext dbContext)
        {
            _logger = logger;
            _userManager = userManager;
            _dbContext = dbContext;
        }

        [BindProperty]
        [FromForm]

        public InputModel Input { get; set; }
        public class InputModel
        {

            [Required]
            public string Code { get; set; }

            [Required]
            [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
            [DataType(DataType.Password)]
            [Display(Name = "Password")]
            public string Password { get; set; }

            [DataType(DataType.Password)]
            [Display(Name = "Confirm password")]
            [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
            public string ConfirmPassword { get; set; }

        }
        public bool Result { get; set; }

        [HttpGet]
        public async Task<IActionResult> OnPost([FromServices] AppDbContext db, string token, string email)
        {
            var user = db.Users.FirstOrDefault(u => u.Email == email);

            _logger.LogInformation(email);
            _logger.LogInformation(Input.Code);
            _logger.LogInformation(Input.Password);
            _logger.LogInformation(Input.ConfirmPassword);
            if (user == null)
            {
                // Handle error: User not found
                return Page();
            }

            // Decode the token
            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));

            _logger.LogInformation(decodedToken);
            // Validate the token
            var result = await _userManager.VerifyUserTokenAsync(user, _userManager.Options.Tokens.PasswordResetTokenProvider, "ResetPassword", decodedToken);

            if (!result)
            {
                // Handle error: Invalid token
                _logger.LogInformation("Invalid token");
                return Page();
            } else
            {
                _logger.LogInformation("valid token");
            }

            Result = false;

            if (user != null)
            {
                _logger.LogInformation("User was found");
                TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
                bool isPinValid = tfa.ValidateTwoFactorPIN(user.TwoFactorKey, Input.Code);
                if (isPinValid)
                {
                    _logger.LogInformation("TFA pin worked");
                    user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, Input.Password);
                    _dbContext.Entry(user).State = EntityState.Modified;
                    await _dbContext.SaveChangesAsync();
                    _logger.LogInformation("Password rest worked");
                    return RedirectToPage("NewLogin");
                }

                _logger.LogInformation("TFA pin did not work");
            }
            _logger.LogInformation("User was not found");
            // If verification fails or user not found, stay on the current page
            return Page();

        }
    }
}
