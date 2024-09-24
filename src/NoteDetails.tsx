import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useParams } from "react-router-dom";

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

const NoteDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const modalElement = document.getElementById("model");
  const [note, setNote] = useState<Note | null>(null);
  const closeModal = () => {
    navigate("..");
  };

  useEffect(() => {
    const fetchNote = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/note/${id}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_APP_PASSWORD}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setNote(data.note);
      }
    };
    fetchNote();
  }, []);

  if (!modalElement) return null;
  return ReactDOM.createPortal(
    <div
      onClick={closeModal}
      className="fixed top-0 w-full h-full bg-gray-200 bg-opacity-30 first-letter:
    backdrop-blur-sm flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[95%] sm:w-[50%] h-[75%] bg-slate-800 p-10 bg-opacity-90 rounded-lg text-white relative"
      >
        {note ? (
          <div className="flex w-[90%] flex-col items-start gap-4">
            <small className="text-slate-400">
              {parseDate(note.createdAt)[0]} • {parseDate(note.createdAt)[1]}
            </small>
            <div className="text-xl break-all">{note.content}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="h-5 w-1/2 bg-gradient-to-r from-slate-600 to-[#242e41] rounded-md animate-pulse"></div>
            <div className="h-7 w-full bg-gradient-to-r from-slate-600 to-[#242e41] rounded-md animate-pulse"></div>
            <div className="h-7 w-full bg-gradient-to-r from-slate-600 to-[#242e41] rounded-md animate-pulse"></div>
            <div className="h-7 w-full bg-gradient-to-r from-slate-600 to-[#242e41] rounded-md animate-pulse"></div>
          </div>
        )}
      </div>
    </div>,
    modalElement
  );
};

export default NoteDetails;
