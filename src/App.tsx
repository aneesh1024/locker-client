import { useEffect, useState } from "react";
import "./App.css";
import toast from "react-hot-toast";
import Notepad from "./assets/notepad.png";
import { DeleteIcon } from "./assets/Icons.tsx";
import { Outlet, Link } from "react-router-dom";

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

const parseDate = (timestamp: string) => {
  const newDate = new Date(timestamp).toLocaleString("en-us", {
    dateStyle: "long",
  });
  const newTime = new Date(timestamp).toLocaleString("en-us", {
    timeStyle: "short",
  });
  return [newDate, newTime];
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [noteList, setNoteList] = useState<Note[]>([]);
  const colors: string[] = [
    "#FF8A8A",
    "#F4DEB3",
    "#96CEB4",
    "#CCE0AC",
    "#F0EAAC",
  ];

  const checkPassword = () => {
    if (password === import.meta.env.VITE_APP_PASSWORD) {
      localStorage.setItem("password", password);
      setIsAuthenticated(true);
      toast.success("Welcome Aneesh");
    } else {
      toast.error("Incorrect password");
    }
  };

  const addNote = async () => {
    if (note === "") {
      toast.error("Note can not be empty");
      return;
    }
    setLoading(true);
    const res = await fetch("http://localhost:5000/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_APP_PASSWORD}`,
      },
      body: JSON.stringify({ note: note }),
    });
    if (res.ok) {
      getAllNotes();
      setNote("");
    }
    setLoading(false);
  };

  const getAllNotes = async () => {
    // setLoading(true);
    const res = await fetch("http://localhost:5000/getall", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_APP_PASSWORD}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      setNoteList(data.notes);
    } else {
      console.log("Something went wrong");
    }
    // setLoading(false);
  };

  const deleteNote = async (id: string) => {
    // setLoading(true);
    const res = await fetch(`http://localhost:5000/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_APP_PASSWORD}`,
      },
    });
    if (res.ok) {
      console.log("note deleted");
      getAllNotes();
    } else {
      console.log("note not deleted");
    }
    // setLoading(false);
  };

  useEffect(() => {
    const storedPassword: string | null = localStorage.getItem("password");
    if (storedPassword === import.meta.env.VITE_APP_PASSWORD) {
      setIsAuthenticated(true);
    }
    const fetchNotes = async () => {
      setInitialLoading(true);
      await getAllNotes();
      setInitialLoading(false);
    };
    fetchNotes();
  }, []);
  if (!isAuthenticated) {
    return (
      <main>
        <div className="w-[90%] sm:w-2/5 py-20 mx-auto items-start flex flex-col gap-10">
          <h1 className="text-3xl font-bold text-slate-500">
            <span className="text-white text-4xl">E</span>nter your password
          </h1>
          <input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-indigo-950 duration-300 focus:border-indigo-700 border-transparent border-4 text-xl px-5 py-2 rounded-lg w-full text-white outline-none"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                checkPassword();
              }
            }}
          />
          <button
            onClick={checkPassword}
            className="px-6 py-2 rounded-md w-1/3 bg-indigo-600 duration-300 hover:bg-indigo-700"
          >
            Submit
          </button>
        </div>
      </main>
    );
  }
  return (
    <>
      <div className="absolute -top-[80px] -left-[100px] hidden sm:block">
        <img src={Notepad} alt="notepad" className="w-[90%]" />
      </div>
      <main className="py-20 flex flex-col gap-10">
        <div className="w-[95%] sm:w-3/5 mx-auto flex gap-4 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Enter a note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-indigo-950 duration-300 focus:border-indigo-700 border-transparent border-4 text-xl px-5 py-2 rounded-lg w-full text-white outline-none"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                addNote();
              }
            }}
            disabled={loading}
          />
          <button
            className="px-6 py-2 flex items-center justify-center rounded-md bg-indigo-600 duration-300 hover:bg-indigo-700"
            onClick={addNote}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 rounded-full animate-spin border-white border-b-indigo-600"></div>
            ) : (
              <span>Add</span>
            )}
          </button>
        </div>
        <div className="w-[95%] sm:w-3/5 mx-auto sm:gap-3">
          {!initialLoading ? (
            noteList.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 sm:flex sm:flex-col w-[95%] sm:w-3/5 mx-auto sm:gap-3">
                {noteList.map((note, index) => {
                  return (
                    <div
                      key={note.id}
                      className="bg-slate-300 min-h-28 sm:min-h-14 text-left flex rounded-lg text-slate-900 font-medium overflow-x-hidden"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    >
                      <Link
                        to={`/${note.id}`}
                        className="flex-[0.9] max-w-[90%] overflow-hidden px-4 py-3 flex flex-col"
                      >
                        <small className="flex flex-col sm:flex-row sm:gap-2 text-[10px] sm:text-[12px] text-zinc-700">
                          <span>{parseDate(note.createdAt)[0]}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{parseDate(note.createdAt)[1]}</span>
                        </small>
                        <div className="text-sm ">
                          {note.content.length > 41
                            ? note.content.slice(0, 41) + "..."
                            : note.content}
                        </div>
                      </Link>
                      <button
                        className="rounded-full flex items-center justify-center  sm:rounded-none m-1 sm:m-0 w-10 h-10 sm:h-auto sm:w-auto flex-[0.1] px-2 py-3 bg-red-600 text-white duration-300 hover:bg-red-800 outline-none border-none"
                        onClick={() => {
                          deleteNote(note.id);
                        }}
                      >
                        <span className="hidden sm:inline">Delete</span>
                        <span className="sm:hidden flex items-center justify-center">
                          <DeleteIcon size={25} />
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10">
                <p className="font-bold text-2xl">
                  <span className="text-4xl text-red-600">N</span>o Notes to
                  show
                </p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:flex sm:flex-col w-[95%] sm:w-3/5 mx-auto sm:gap-3">
              <div className="h-28 w-full bg-gradient-to-r animate-pulse from-slate-400 to-zinc-600 rounded-lg"></div>
              <div className="h-28 w-full bg-gradient-to-r animate-pulse from-slate-400 to-zinc-600 rounded-lg"></div>
              <div className="h-28 w-full bg-gradient-to-r animate-pulse from-slate-400 to-zinc-600 rounded-lg"></div>
              <div className="h-28 w-full bg-gradient-to-r animate-pulse from-slate-400 to-zinc-600 rounded-lg"></div>
            </div>
          )}
        </div>
        <Outlet />
      </main>
    </>
  );
}

export default App;
