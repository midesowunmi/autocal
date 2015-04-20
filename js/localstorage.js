/**
 * Created with JetBrains WebStorm.
 * User: Mide
 * Date: 9/1/14
 * Time: 9:09 PM
 * To change this template use File | Settings | File Templates.
 */
if (typeof(localStorage) == "undefined" ) {
    alert("Your browser does not support HTML5 localStorage. Try upgrading.");
} else {
    try {
        localStorage.setItem("name", "Hello World!"); //saves to the database, “key”, “value”
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert("Quota exceeded!"); //data wasn’t successfully saved due to quota exceed so throw an error
        }
    }

    document.write(localStorage.getItem("name")); //Hello World!
    localStorage.removeItem("name"); //deletes the matching item from the database
}
