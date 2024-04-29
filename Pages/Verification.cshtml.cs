using Google.Authenticator;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using static System.Runtime.CompilerServices.RuntimeHelpers;
using CS451_Team_Project.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Build.Evaluation;

namespace CS451_Team_Project.Pages
{
    public class VerificationModel : PageModel
    {
        public string QrCodeUrl { get; set; }
        public string ManualEntryCode { get; set; }

        [FromRoute]
        public string EmailAddress { get; set; }

        [FromForm]

        public InputModel Input { get; set; }
        public class InputModel
        {
            public string Code { get; set; }
        }
        public bool Result {  get; set; }

        public void OnGet([FromServices] AppDbContext db, [FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                // Handle the case where the email is not provided in the URL
                // You may want to redirect to an error page or show a message
                // someone else do this -KM
            }

            var user = db.Users.FirstOrDefault(u => u.Email == email);

            if (user != null && string.IsNullOrEmpty(user.TwoFactorKey))
            {
                // Generate a random key
                string key = GenerateRandomString(10);

                // Save the key to the user in the database
                user.TwoFactorKey = key;
                db.SaveChanges();

                TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
                SetupCode setupInfo = tfa.GenerateSetupCode("Test Two Factor", user.Email, key, false, 3);

                QrCodeUrl = setupInfo.QrCodeSetupImageUrl;
                ManualEntryCode = setupInfo.ManualEntryKey;
            }
            else if (user != null)
            {
                // The user already has a TwoFactorKey, use the existing one
                TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
                SetupCode setupInfo = tfa.GenerateSetupCode("Test Two Factor", user.Email, user.TwoFactorKey, false, 3);

                //QrCodeUrl = setupInfo.QrCodeSetupImageUrl;
                //ManualEntryCode = setupInfo.ManualEntryKey;
            }
            else
            {
                // Handle the case where the user is not found in the database
                // You may want to redirect to an error page or show a message
            }
        }


        public IActionResult OnPost([FromServices] AppDbContext db, [FromQuery] string email)
        {
            Result = false;
            var user = db.Users.FirstOrDefault(u => u.Email == email);

            if (user != null)
            {
                TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
                bool isPinValid = tfa.ValidateTwoFactorPIN(user.TwoFactorKey, Input.Code);
                if (isPinValid)
                {
                    // Set the redirect URL upon successful verification
                    return RedirectToPage("Dashboard"); // Replace "/YourRedirectPage" with the desired page
                }
            }

            // If verification fails or user not found, stay on the current page
            return Page();
        }

        // Other methods...



        public static string GenerateRandomString(int length, string allowableChars = null)
        {
            if (string.IsNullOrEmpty(allowableChars))
            {
                allowableChars = @"ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            }

            var rnd = new byte[length];
            using (var rng = new RNGCryptoServiceProvider())
                rng.GetBytes(rnd);

            var allowable = allowableChars.ToCharArray();
            var l = allowable.Length;
            var chars = new char[length];
            for (var i = 0; i < length; i++)
            {
                chars[i] = allowable[rnd[i] % l];
            }

            return new string(chars);
        }
    }
}

