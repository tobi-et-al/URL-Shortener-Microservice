# URL Shortener Microservice

  
Example creation usage:

https://green-kitty.herokuapp.com/new/https://www.google.com
https://green-kitty.herokuapp.com/new/http://foo.com:80

Example creation output

    { 
      "original_url":"http://foo.com:80", 
      "short_url":"https://green-kitty.herokuapp.com/8170" 
    }
    
Usage:

https://green-kitty.herokuapp.com/2871

Will redirect to:

https://www.google.com/
