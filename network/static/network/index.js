document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelector('#all_posts').addEventListener('click', () => load_posts())

    load_posts();
});

const load_posts = () => {

    document.querySelector("#posts").innerHTML = "";
    
    fetch("/api/posts/")
        .then(response => response.json())
        .then(data => {
            const posts_container = document.querySelector("#posts");
            data.forEach(e => {
                const post_container = document.createElement("div");
                post_container.classList.add("post_container");
                post_container.classList.add("container");


                const post_author = document.createElement("h3");
                const post_body = document.createElement("p");
                const post_timestamp = document.createElement("p");
                const post_likes = document.createElement("p");
                const post_unlikes = document.createElement("p");


                post_author.textContent = e.author;
                post_body.textContent = e.body;
                post_timestamp.textContent = e.timestamp;
                post_likes.textContent = "Likes: " + e.post_like;
                post_unlikes.textContent = "Unlikes: " + e.post_unlike;


                post_container.append(post_timestamp);
                post_container.append(post_author);
                post_container.append(post_body);
                post_container.append(post_likes);
                post_container.append(post_unlikes);

                posts_container.append(post_container);
                
            });



        })
        
}