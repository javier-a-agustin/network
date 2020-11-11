document.addEventListener('DOMContentLoaded', () => {

    post_send = document.querySelector('#post-send');
    post_send = document.querySelector('#post-send');
    
    if (post_send) post_send.addEventListener("submit", e => handleSubmit(e));
        
    load_posts(1);

});

const handleSubmit = (e) => {

    e.preventDefault();
    
    fetch('/api/create-post/', {
        method: "POST",
        body: JSON.stringify({
            body: document.querySelector("#post-body").value
        })
    })
    .then( () => load_posts(1))
    .catch(err => console.error(err));
    document.querySelector("#post-body").value = "";
    return 0;
}   

const load_posts = (num_page) => {

    document.querySelector("#post-send").style.display = 'flex';
    document.querySelector("#posts").style.display = 'block';
    document.querySelector("#post").style.display = 'none';
    document.querySelector("#profile").style.display = 'none';
    document.querySelector("#following").style.display = 'none';
    document.querySelector("#posts").innerHTML = "";

    
    fetch(`/api/posts/${num_page}/`)
        .then(response => response.json())
        .then(data => {
            const posts_container = document.querySelector("#posts");
            data[1].forEach(e => {
                const post_container = document.createElement("div");
                post_container.classList.add("post_container");
                post_container.classList.add("container");


                const post_author = document.createElement("p");
                const post_body = document.createElement("h6");
                const post_timestamp = document.createElement("p");
                const post_likes = document.createElement("p");
                const post_unlikes = document.createElement("p");

                post_author.classList.add("author");
                post_body.classList.add("body");
                post_timestamp.classList.add("timestamp");
                post_likes.classList.add("likes");
                post_unlikes.classList.add("unlikes");

                post_author.setAttribute("onclick", `showProfile("${e.author}", 1)`);

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

            if (data[0].has_previous){
                console.log("Has previous")
                const previous = document.createElement("button");
                previous.textContent = "Previous";
                previous.setAttribute("onclick", `load_posts(${num_page-1})`);
                posts_container.append(previous);
                
            }

            if (data[0].has_next){
                console.log("Has Next")
                const next = document.createElement("button");
                next.textContent = "Next";
                next.setAttribute("onclick", `load_posts(${num_page+1})`);
                posts_container.append(next);
            }

        })
        
}

//corazon https://icongr.am/feather/heart.svg?size=128&color=currentColor

const showProfile = (profileName, num_page) => {
    document.querySelector("#post-send").style.display = 'none';
    document.querySelector("#posts").style.display = 'none';
    document.querySelector("#post").style.display = 'none';
    document.querySelector("#following").style.display = 'none';
    document.querySelector("#profile").style.display = 'block';
    document.querySelector("#profile").innerHTML = "";
    
    fetch(`/api/user/${profileName}/${num_page}`)
        .then(res => res.json())
        .then(data => {

            const username = document.createElement("h2");
            const followers = document.createElement("p");
            const following = document.createElement("p");
            

            username.textContent = data[1][0].username;

            followers.textContent = `Followers: ${data[1][0].followers}`;
            following.textContent = `Following: ${data[1][0].following}`;


            document.querySelector("#profile").append(username);
            document.querySelector("#profile").append(followers);
            document.querySelector("#profile").append(following);

            if (user_username !== data[1][0].username) {

                const a = data[3].some( follow => follow["from"]["username"] === `${user_username}` && follow["to"]["username"] === data[1][0].username );
                const followUnfollow = document.createElement("button");
                if (a) {
                    followUnfollow.textContent = "Unfollow";
                    followUnfollow.classList.add("btn");
                    followUnfollow.classList.add("btn-dark");
                    followUnfollow.setAttribute("onclick", `unfollow("${data[1][0].username}", ${num_page})`)

                } else {
                    followUnfollow.textContent = "Follow";
                    followUnfollow.classList.add("btn");
                    followUnfollow.classList.add("btn-dark");
                    followUnfollow.setAttribute("onclick", `follow("${data[1][0].username}", ${num_page})`)
                }   
                document.querySelector("#profile").append(followUnfollow);

            } 


            const posts = document.createElement("div");
            document.querySelector("#profile").append(posts);

            data[2].forEach(e => {

                const post_container = document.createElement("div");
                post_container.classList.add("post_container");
                post_container.classList.add("container");


                const post_author = document.createElement("p");
                const post_body = document.createElement("h6");
                const post_timestamp = document.createElement("p");
                const post_likes = document.createElement("p");
                const post_unlikes = document.createElement("p");

                post_author.classList.add("author");
                post_body.classList.add("body");
                post_timestamp.classList.add("timestamp");
                post_likes.classList.add("likes");
                post_unlikes.classList.add("unlikes");

                // post_author.setAttribute("onclick", `showProfile("${e.author}")`);

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

                posts.append(post_container);
                
            });

            if (data[0].has_previous){
                const previous = document.createElement("button");
                previous.textContent = "Previous";
                previous.setAttribute("onclick", `showProfile("${profileName}", ${num_page-1})`);
                posts.append(previous);
                
            }

            if (data[0].has_next){
                const next = document.createElement("button");
                next.textContent = "Next";
                next.setAttribute("onclick", `showProfile("${profileName}", ${num_page+1})`);
                posts.append(next);
            }
        }
    )
}

const unfollow = (to, num_page) => {
    fetch("api/unfollow/", {
        method: 'POST',
        body: JSON.stringify({
            to: to,
        })
    })
    .then(res => {
        showProfile(to, num_page);
    })
    .catch(err => {
        console.log(err);
        showProfile(to, num_page);
    })
}

const follow = (to, num_page) => {
    fetch("api/follow/", {
        method: 'POST',
        body: JSON.stringify({
            to: to,
        })
    })
        .then(res => {
            showProfile(to, num_page);
        }
    )
    .catch(err => {
        console.log(err);
        showProfile(to, num_page);
    })
}

const following = (num_page) => {
    document.querySelector("#post-send").style.display = 'flex';
    document.querySelector("#posts").style.display = 'none';
    document.querySelector("#post").style.display = 'none';
    document.querySelector("#profile").style.display = 'none';
    document.querySelector("#following").style.display = 'block';
    document.querySelector("#following").innerHTML = "";

    fetch(`/api/following/${num_page}/`)
        .then(res => res.json())
        .then(data => {
     
            const posts = document.createElement("div");
            document.querySelector("#following").append(posts);

            data[1].forEach(e => {

                const post_container = document.createElement("div");
                post_container.classList.add("post_container");
                post_container.classList.add("container");


                const post_author = document.createElement("p");
                const post_body = document.createElement("h6");
                const post_timestamp = document.createElement("p");
                const post_likes = document.createElement("p");
                const post_unlikes = document.createElement("p");

                post_author.classList.add("author");
                post_body.classList.add("body");
                post_timestamp.classList.add("timestamp");
                post_likes.classList.add("likes");
                post_unlikes.classList.add("unlikes");

                // post_author.setAttribute("onclick", `showProfile("${e.author}")`);

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

                posts.append(post_container);
                
            });

            if (data[0].has_previous){
                console.log("Has previous")
                const previous = document.createElement("button");
                previous.textContent = "Previous";
                previous.setAttribute("onclick", `following(${num_page-1})`);
                posts.append(previous);
                
            }

            if (data[0].has_next){
                console.log("Has Next")
                const next = document.createElement("button");
                next.textContent = "Next";
                next.setAttribute("onclick", `following(${num_page+1})`);
                posts.append(next);
            }
        }
    )
}