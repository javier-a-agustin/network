var editing = false;
var i = null;
document.addEventListener('DOMContentLoaded', () => {

    post_send = document.querySelector('#post-send');
    
    if (post_send) post_send.addEventListener("submit", e => handleSubmit(e));
        
    load_posts(1);

});

const handleSubmit = (e) => {

    e.preventDefault();
    
    if (editing) {
        fetch('/api/edit/', {
            method: "PUT",
            body: JSON.stringify({
                new_body: document.querySelector("#post-body").value,
                id: i
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            document.querySelector(`#id${i} .body`).textContent = data.body;
            if  ( !document.querySelector(`#id${i} .timestamp`).textContent.endsWith(" | Edited") ) {
                document.querySelector(`#id${i} .timestamp`).textContent += " | Edited";
            };
            document.querySelector("#stopEditing").remove()
            document.querySelector("#alertEditing").remove()
            const elmnt = document.getElementById(`id${i}`);
            elmnt.scrollIntoView();
            editing = false;
            i = null;
        })
        .catch(err => console.error(err));
        document.querySelector("#post-body").value = "";
        return 0;
    } else {
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
    
}   

const load_posts = (num_page) => {

    document.querySelector("#post-send").style.display = 'flex';
    document.querySelector("#posts").style.display = 'block';
    document.querySelector("#profile").style.display = 'none';
    document.querySelector("#following").style.display = 'none';
    document.querySelector("#following").innerHTML = "";
    document.querySelector("#posts").innerHTML = "";
    document.querySelector("#profile").innerHTML = "";

    
    fetch(`/api/posts/${num_page}/`)
        .then(response => response.json())
        .then(data => {
            const posts_container = document.querySelector("#posts");

            data[1].forEach(e => {
                const post_container = document.createElement("div");
                post_container.setAttribute("id", `id${e.id}`);
                post_container.classList.add("post_container");
                post_container.classList.add("container");


                const post_author = document.createElement("p");
                const post_body = document.createElement("h6");
                const post_timestamp = document.createElement("p");
                const post_likes = document.createElement("p");
                const post_like = document.createElement("button");

                post_author.classList.add("author");
                post_body.classList.add("body");
                post_timestamp.classList.add("timestamp");
                post_likes.classList.add("likes");
                post_like.classList.add("btn");
                post_like.classList.add("btn-primary");

                post_like.classList.add("post-like");

                post_author.setAttribute("onclick", `showProfile("${e.author}", 1)`);

                post_author.textContent = e.author;
                post_body.textContent = e.body;
                post_timestamp.textContent = e.timestamp;
                
                info_like = data[2].find(element => element.post_to === e.id)
                
                post_like.textContent = "Like";
                post_like.setAttribute("onclick", `like(${e.id})`)

                if (info_like) {
                    if (info_like.user_from === user_username) {
                        post_like.textContent = "Unlike";
                    }
                }

                if (e.edited) {
                    post_timestamp.textContent += " | Edited";
                }

                post_likes.textContent = "Likes: " + e.post_like;

                post_container.append(post_timestamp);
                post_container.append(post_author);
                post_container.append(post_body);
                post_container.append(post_likes);

                const btn_container = document.createElement("div");
                btn_container.append(post_like);
                btn_container.classList.add("btn-container");

                if (user_username === e.author) {
                    const editButton = document.createElement("button");
                    editButton.textContent = "Edit";
                    editButton.classList.add("btn");
                    editButton.classList.add("btn-info");
                    editButton.setAttribute("onclick", `edit("${e.body}", ${e.id})`);
                    btn_container.append(editButton);
                };

                post_container.append(btn_container);
                posts_container.append(post_container);

                
            });


            const buttons_container = document.createElement("div");
            buttons_container.classList.add("buttons-container")
            if (data[0].has_previous){
                const previous = document.createElement("button");
                previous.classList.add("btn");
                previous.classList.add("btn-primary");
                previous.classList.add("previous");
                previous.innerHTML = '<img style="width: 20px;" src="https://icongr.am/feather/arrow-left.svg?size=128&color=currentColor"> Previous';
                previous.setAttribute("onclick", `load_posts(${num_page-1})`);
                buttons_container.append(previous);
                
            }

            if (data[0].has_next){
                const next = document.createElement("button");
                next.classList.add("btn");
                next.classList.add("btn-primary");
                next.classList.add("next");
                next.innerHTML = '<img style="width: 20px;" src="https://icongr.am/feather/arrow-right.svg?size=128&color=currentColor"> Next';
                next.setAttribute("onclick", `load_posts(${num_page+1})`);
                buttons_container.append(next);
            }

            posts.append(buttons_container);

        })
        
}

const like = id_post => {

    console.log(id_post);

    fetch("api/toggle-like/", {
        method: "POST",
        body: JSON.stringify({
            id_post: id_post
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        document.querySelector(`#id${id_post} .likes`).textContent = "Likes: " + data.post_likes_count;
        var t = ""
        data.user_like_post ? t = "Unlike" : t = "Like";
        document.querySelector(`#id${id_post} .post-like`).textContent = t;

    })
    .catch(err => {
        console.log(err);
    })

}

const edit = (body_content, code) => {
    window.scrollTo(0, 0);
    const stopEditing = document.createElement("button");
    const alertEditing = document.createElement("p");
    stopEditing.setAttribute("id", "stopEditing");
    alertEditing.setAttribute("id", "alertEditing");

    stopEditing.classList.add("btn");
    stopEditing.classList.add("btn-danger");

    alertEditing.textContent = "Editing";
    stopEditing.textContent = "Stop editing";
    stopEditing.setAttribute("onclick", "stop_editing()")

    document.querySelector("#post-send").append(alertEditing);
    document.querySelector("#post-send").append(stopEditing);
    editing = true;
    i = code;
    document.querySelector("#post-body").value = body_content;
}

const stop_editing = () => {
    document.querySelector("#stopEditing").remove()
    document.querySelector("#alertEditing").remove()
    document.querySelector("#post-body").value = "";
    editing = false;
    i = null;
}


const showProfile = (profileName, num_page) => {
    document.querySelector("#post-send").style.display = 'none';
    document.querySelector("#posts").style.display = 'none';
    document.querySelector("#following").style.display = 'none';
    document.querySelector("#profile").style.display = 'block';
    document.querySelector("#following").innerHTML = "";
    document.querySelector("#posts").innerHTML = "";
    document.querySelector("#profile").innerHTML = "";
    
    fetch(`/api/user/${profileName}/${num_page}`)
        .then(res => res.json())
        .then(data => {

            const username = document.createElement("h2");
            const followers = document.createElement("p");
            const following = document.createElement("p");
            const info_container = document.createElement("div");
            const container_1 = document.createElement("div");
            const container_2 = document.createElement("div");
            info_container.classList.add("info-container");
            
            username.textContent = data[1][0].username;

            followers.textContent = `Followers: ${data[1][0].followers}`;
            following.textContent = `Following: ${data[1][0].following}`;

            container_1.append(username);
            container_2.append(followers);
            container_2.append(following);



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
                container_1.append(followUnfollow);

            } 
            info_container.append(container_1);
            info_container.append(container_2);            

            document.querySelector("#profile").append(info_container);

            const posts = document.createElement("div");
            document.querySelector("#profile").append(posts);

            data[2].forEach(e => {

                const post_container = document.createElement("div");
                post_container.setAttribute("id", `id${e.id}`);
                post_container.classList.add("post_container");
                post_container.classList.add("container");


                const post_author = document.createElement("p");
                const post_body = document.createElement("h6");
                const post_timestamp = document.createElement("p");
                const post_likes = document.createElement("p");
                const post_like = document.createElement("button"); 

                post_author.classList.add("author");
                post_body.classList.add("body");
                post_timestamp.classList.add("timestamp");
                post_likes.classList.add("likes");
                post_like.classList.add("post-like");
                post_like.classList.add("btn");
                post_like.classList.add("btn-primary");

                post_author.setAttribute("onclick", `showProfile("${e.author}", 1)`);

                post_author.textContent = e.author;
                post_body.textContent = e.body;
                post_timestamp.textContent = e.timestamp;
                post_likes.textContent = "Likes: " + e.post_like;

                post_like.textContent = "Like";
                post_like.setAttribute("onclick", `like(${e.id})`)

                info_like = data[4].find(element => element.post_to === e.id)

                if (info_like) {
                    console.log(info_like);
                    if (info_like.user_from === user_username) {
                        post_like.textContent = "Unlike";
                    }
                }

                post_container.append(post_timestamp);
                post_container.append(post_author);
                post_container.append(post_body);
                post_container.append(post_likes);

                const btn_container = document.createElement("div");
                btn_container.append(post_like);
                btn_container.classList.add("btn-container");
                post_container.append(btn_container);
                posts.append(post_container);
                
            });

            const buttons_container = document.createElement("div");
            buttons_container.classList.add("buttons-container")
            if (data[0].has_previous){
                const previous = document.createElement("button");
                previous.classList.add("btn");
                previous.classList.add("btn-primary");
                previous.classList.add("previous");
                previous.innerHTML = '<img style="width: 20px;" src="https://icongr.am/feather/arrow-left.svg?size=128&color=currentColor"> Previous';
                previous.setAttribute("onclick", `showProfile("${profileName}", ${num_page-1})`);
                buttons_container.append(previous);
                
            }

            if (data[0].has_next){
                const next = document.createElement("button");
                next.classList.add("btn");
                next.classList.add("btn-primary");
                next.classList.add("next");
                next.innerHTML = '<img style="width: 20px;" src="https://icongr.am/feather/arrow-right.svg?size=128&color=currentColor"> Next';
                next.setAttribute("onclick", `showProfile("${profileName}", ${num_page+1})`);
                buttons_container.append(next);
            }

            posts.append(buttons_container);
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
    document.querySelector("#post-send").style.display = 'none';
    document.querySelector("#posts").style.display = 'none';
    document.querySelector("#profile").style.display = 'none';
    document.querySelector("#following").style.display = 'block';
    document.querySelector("#following").innerHTML = "";
    document.querySelector("#posts").innerHTML = "";
    document.querySelector("#profile").innerHTML = "";

    fetch(`/api/following/${num_page}/`)
        .then(res => res.json())
        .then(data => {
     
            const posts = document.createElement("div");
            document.querySelector("#following").append(posts);
            const following_title = document.createElement("h2");
            following_title.classList.add("following-title");
            following_title.textContent = "Following";
            posts.append(following_title);

            if (data[1].length < 1) {
                const nothing_to_displat = document.createElement("h2");
                nothing_to_displat.textContent = "Nothing to Display";
                posts.append(nothing_to_displat);
            }

            data[1].forEach(e => {

                const post_container = document.createElement("div");
                post_container.setAttribute("id", `id${e.id}`);
                post_container.classList.add("post_container");
                post_container.classList.add("container");


                const post_author = document.createElement("p");
                const post_body = document.createElement("h6");
                const post_timestamp = document.createElement("p");
                const post_likes = document.createElement("p");
                const post_like = document.createElement("button"); 

                post_author.classList.add("author");
                post_body.classList.add("body");
                post_timestamp.classList.add("timestamp");
                post_likes.classList.add("likes");
                post_like.classList.add("post-like");
                post_like.classList.add("btn");
                post_like.classList.add("btn-primary");

                post_author.textContent = e.author;
                post_body.textContent = e.body;
                post_timestamp.textContent = e.timestamp;
                post_likes.textContent = "Likes: " + e.post_like;

                post_author.setAttribute("onclick", `showProfile("${e.author}", 1)`);

                post_like.textContent = "Like";
                post_like.setAttribute("onclick", `like(${e.id})`)

                info_like = data[2].find(element => element.post_to === e.id)

                if (info_like) {
                    if (info_like.user_from === user_username) {
                        post_like.textContent = "Unlike";
                    }
                }

                post_container.append(post_timestamp);
                post_container.append(post_author);
                post_container.append(post_body);
                post_container.append(post_likes);

                const btn_container = document.createElement("div");
                btn_container.append(post_like);
                btn_container.classList.add("btn-container");
                post_container.append(btn_container);

                posts.append(post_container);
                
            });

            const buttons_container = document.createElement("div");
            buttons_container.classList.add("buttons-container")
            if (data[0].has_previous){
                const previous = document.createElement("button");
                previous.classList.add("btn");
                previous.classList.add("btn-primary");
                previous.classList.add("previous");
                previous.innerHTML = '<img style="width: 20px;" src="https://icongr.am/feather/arrow-left.svg?size=128&color=currentColor"> Previous';
                previous.setAttribute("onclick", `following(${num_page-1})`);
                buttons_container.append(previous);
                
            }

            if (data[0].has_next){
                const next = document.createElement("button");
                next.classList.add("btn");
                next.classList.add("btn-primary");
                next.classList.add("next");
                next.innerHTML = '<img style="width: 20px;" src="https://icongr.am/feather/arrow-right.svg?size=128&color=currentColor"> Next';
                next.setAttribute("onclick", `following(${num_page+1})`);
                buttons_container.append(next);
            }

            posts.append(buttons_container);
        

            
        
        
        }
    )
}