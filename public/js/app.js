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
            $("article").html("<div class='px-0' id='success'>Scrape successful.</div><div class='px-0' id='counter'>Loading articles in 3 seconds.")
            setInterval(() => { 
                $("#counter").html(`Loading articles in ${seconds} seconds.`)
                    seconds-- 
                    if (seconds === 1) { 
                        setTimeout(() => {
                            window.location.href = "/" 
                        },1500) // Slow the counter by half a second
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
        $(`#note-${id}`).append(`<li class="bg-light pr-3 rounded" data-note=${e.note[count-1]}><b>${moment().format("YYYY-MM-DD")}</b><br> ${noteText.val()}<div class="delete bg-danger d-none rounded-right px-3"><b>X</b></div></li>`)
        $(document).find(`[data-article='${id}']`).text(`Notes (${count})`)
        noteText.val("")
    });   
});

// Handle adding notes and refreshing page
$(document).on("click", ".note-button", function(e) { 
    e.preventDefault()
    let id = $(this).data("article"); 

    // Get the notes for the article selected
    $.get(`/article/notes/${id}`, (e) => { 
        $(`#note-${id}`).html("")

        $.each(e, (i, element) => { 
            // Append notes
            $(`#note-${id}`).append(`<li class="bg-light pr-3 rounded-left" data-note=${e[i]._id}><b>${moment(e[i].date).format("YYYY-MM-DD")}</b><br> ${e[i].body}<div class="delete bg-danger d-none rounded-right px-3"><b>X</b></div></li>`)
        });
    }); 
    // Start at the anchor, move up to the parent div
    // Find the next div and toggle on/off notes
    $(this).parent().next().toggleClass("d-none")
    $(this).parent().next().next().toggleClass("d-none")
});

// Toggle red background and reveal delete button on note select
$(document).on("click", "li", function() {
    

    $(this).toggleClass("bg-danger bg-light text-white")
    $(this).children().not("span").toggleClass("d-none")
    $(this).toggleClass("delete-note")
});

// Handle note deletion
$(document).on("click", ".delete", function() {
    const noteId = $(this).parent().data("note")
    const articleId = $(this).parent().parent().attr("id").replace("note-","")
    let count;
    // Show delete button
    $(this).parent().toggleClass("d-none")

    // Delete note
    $.post("/note/delete", { id: noteId, article: articleId}).then((e) => { 
        count = e.note.length - 1; 
        // Decrease note count when deleted
        $(document).find(`[data-article='${articleId}']`).text(`Notes (${count})`)
    })
})

// Handle removing article from saved
$(document).on("click", ".remove-button", function(e){
    e.preventDefault()
    let articleId = $(this).data("article-remove")
    // Delete article
    $.post("/article/remove", { id: articleId }).then(window.location.href = "/saved")
});