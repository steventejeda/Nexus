import './post.css'
import {MoreVert} from "@mui/icons-material"; 

export default function Post() {
  return (
    <div className="post">
        <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                    <img className='postProfileImg' src="assets/person/1.jpeg" alt="" />
                    <span className="postUsername">Jane Doe</span>
                    <span className="postDate">5 min ago</span>
                </div>
                <div className="postTopRight">
                    <MoreVert />
                </div>
            </div>
            <div className="postCenter">
                <span className="postText">This is my first post! Follow me.</span>
                <img className="postImg" src="assets/post/1.jpeg" alt="" />
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                    <img className='likeIcon' src="assets/like.png" alt="" />
                    <img className='likeIcon' src="assets/heart.png" alt="" />
                    <span className="postlikeCounter">32</span>
                </div>
                <div className="postBottomRight">
                    <div className="postCommentText">9 comments</div>
                </div>
            </div>
        </div>
    </div>
  )
}
