module.exports = function (googleLoginProvider) {
    googleLoginProvider.configure({
        clientId: '6761897143-ou9g6m0cedtmcp6hk8t3jbnnsqiavkc6.apps.googleusercontent.com',
       //uses ClientId for Web Application with secret 9IEJcXG9_kBMSALrPSfiXpl7 midethesis@gmail account
        // differs from the offline versions ClientId
        scopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/plus.me"],
        apiKey: 'AIzaSyAEIXWXcr8Oyj5ixFoz9apKPr0flPBV5oc'
    };
