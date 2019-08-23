// Page styling
if (location.pathname === "/saved") { // Bold "Saved Articles" if page is open
    $(".saved").addClass("font-weight-bold")
} else { 
    $(".home").addClass("font-weight-bold") // Bold "Home" if page is open
}

$(".bottom").last().toggleClass("bottom") // Remove bottom border on final article


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


$(document).on("click", ".save", function(e) {
    e.preventDefault()
    let articleId = $(this).data("article")
    $.post("/article/save", {id: articleId})
    window.location.href = "/"
});

$(document).on("click", ".note", function(e) {
    e.preventDefault()
    const note = {
        id: $(this).data("article-id"),
        note: $(this).parent().parent().parent().find(".note-text").val()
    }

    $.post("/note/save", note, function(e) {
        console.log(e)
    });   
});

$(document).on("click", ".note-button", function(e) { 
    e.preventDefault()
    let id = $(this).data("article-id"); 

    $.get(`/article/notes/${id}`, function(e) { 
        $(`#note-${id}`).html("")

        $.each(e, function(i, element){ 
            $(`#note-${id}`).append(`<li>${e[i].body}</li>`)
        });
    }); 
    // Start at the anchor, move up to the parent div
    // Find the next div and toggle on/off notes
    $(this).parent().next().toggleClass("d-none")
})