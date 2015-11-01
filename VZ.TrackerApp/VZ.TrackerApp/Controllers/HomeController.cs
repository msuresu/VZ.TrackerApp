using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VZ.TrackerApp.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetName(string strName)
        {
            string strMessage = "Search Name not Exits";
            if (strName.Equals("Test"))
            {
                strMessage = "Search Name Exits";
            }
            return Json(strMessage, JsonRequestBehavior.AllowGet);
        }
    }
}