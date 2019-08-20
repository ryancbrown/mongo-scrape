$("#scrapePage").on("click", (e) => {
    $.get("/scrape", (element) => { 
        console.log(element)
    });
});