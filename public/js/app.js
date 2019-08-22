// Scrape newest articles
$("#scrapePage").on("click", (e) => {
    $.get("/scrape", (element) => { 
        // Once the scrape occurs clean out current page
        $("article").html("")
        // Print success
        if (element === "Scrape successful.") {
            // Show the user a countdown and redirect to home page 
            // Home page returns 20 most recent articles stored
            let seconds = 2           
            $("article").html("<div class='px-0' id='success'>Scrape successful.</div><div class='px-0' id='counter'>Redirecting in 3 seconds.")
            setInterval(() => { 
                $("#counter").html(`Redirecting in ${seconds} seconds.`)
                    seconds-- 
                    if (seconds === 1) { 
                    setTimeout(() => {
                    window.location.href = "/" 
                    },1500)}
                },1000)
        } else { 
            // Show error
            $("article").html("Scrape failed. Try again in a few moments.")
        }
    });
});