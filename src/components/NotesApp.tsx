import React, { useState, useEffect } from "react";
import "./NotesApp.css";

interface Note {
  id: number;
  title: string;
  content: string;
}

function NoteApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [notes]);

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notes");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data: Note[] = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(event.target.value);
  };

  const handleAddNote = async () => {
    if (inputTitle.trim() !== "" && inputContent.trim() !== "") {
      try {
        await fetch("http://localhost:5000/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: inputTitle, content: inputContent }),
        });
        setInputTitle("");
        setInputContent("");
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
  };

  return (
    <div className="NotesApp">
      <div className="Inputs">
        <input
          type="text"
          value={inputTitle}
          onChange={handleTitleChange}
          placeholder="Title"
        />
        <input
          type="text"
          value={inputContent}
          onChange={handleContentChange}
          className="inputContent"
          placeholder="Content"
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>
      <div>
        <h2>Notes:</h2>
        <ul>
          {notes.map((note: Note) => (
            <li key={note.id}>
              <div>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NoteApp;
