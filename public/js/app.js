// Page styling
if (location.pathname === "/saved") { // Bold "Saved Articles" if page is open
    $(".saved").addClass("font-weight-bold")
} else { 
    $(".home").addClass("font-weight-bold") // Bold "Home" if page is open
}

$(".bottom").last().toggleClass("bottom") // Remove bottom border on final article


// Scrape newest articles from NPR world news
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
                        },1500)
                    }
                },1000)
        } else { 
            // Show error
            $("article").html("Scrape failed. Try again in a few moments.")
        }
    });
});

// Handle saving of a scraped article
$(document).on("click", ".save", function(e) {
    e.preventDefault()
    let articleId = $(this).data("article")
    $.post("/article/save", { id: articleId }).then(window.location.href = "/")
});

// Handle note creation
$(document).on("click", ".note", function(e) {
    e.preventDefault()
    let id = $(this).data("article-id"); 
    let noteText = $(document).find(`[data-article-input='${id}']`)
    let count;

    // Build note object
    const note = {
        id: $(this).data("article-id"),
        note: $(this).parent().parent().parent().find(".note-text").val(), 
        date: new Date()
    }

    // Post to server for it to be saved
    $.post("/note/save", note, (e) => {
        count = e.note.length
        $(`#note-${id}`).append(`<li>` + moment().format("MMM, DD") + ": " + `${noteText.val()}</li>`)
        $(document).find(`[data-article='${id}']`).text(`Notes (${count})`)
        noteText.val("")
    });   
});

// Handle adding notes and refreshing page
$(document).on("click", ".note-button", function(e) { 
    e.preventDefault()
    let id = $(this).data("article"); 

    $.get(`/article/notes/${id}`, (e) => { 
        $(`#note-${id}`).html("")

        $.each(e, (i, element) => { 
            $(`#note-${id}`).append(`<li>${moment(e[i].date).format("MMM. DD")}` + ": " + `${e[i].body}</li>`)
        });
    }); 
    // Start at the anchor, move up to the parent div
    // Find the next div and toggle on/off notes
    $(this).parent().next().toggleClass("d-none")
    $(this).parent().next().next().toggleClass("d-none")
})