import video from "../assets/video.mp4";
import NoteApp from "./NotesApp";
const BgVideos = () => {
  return (
    <div className="bgContainer">
      <div className="overay">
        <video src={video} autoPlay loop muted />
        <div className="container">
          <h2 className="title">Notes</h2>
          <NoteApp />
        </div>
        <div className="inputBox">
          <input
            type="search"
            name="search-form"
            id="search-form"
            className="search-input"
            placeholder="     Search user"
          />
        </div>
      </div>
    </div>
  );
};

export default BgVideos;
