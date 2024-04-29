using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.IO;

namespace CS451_Team_Project.Pages
{
    public class FileUploadModel : PageModel
    {

        /// <summary>
        /// in the demo we just need to show the page
        /// for some reason the code is giving an error during runtime 
        /// </summary>
        //private readonly UserManager<IdentityUser> _userManager;

        //public FileUploadModel(UserManager<IdentityUser> userManager)
        //{
        //    _userManager = userManager;
        //}
        
        [BindProperty]
        public List<IFormFile> UploadedFiles { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            //var user = await _userManager.GetUserAsync(User);
            //var userId = user?.Id;

            foreach (var file in UploadedFiles)
            {
                //var filePath = Path.Combine("UserImages", userId, file.FileName);

            //    if (!Directory.Exists(Path.GetDirectoryName(filePath)))
            //    {
            //        Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            //    }

            //    using (var stream = System.IO.File.Create(filePath))
            //    {
            //        await file.CopyToAsync(stream);
            //    }
            }

            return RedirectToPage("./Index");
        }
    }
}
