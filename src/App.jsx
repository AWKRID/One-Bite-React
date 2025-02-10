import "./App.css";
import { useReducer, useRef, createContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import NotFound from "./pages/NotFound";
import { getEmotionImage } from "./utils/get-emotion-image";
import Button from "./components/button";
import Header from "./components/Header";
import Edit from "./pages/Edit";

const mockData = [
  {
    id: 1,
    createdDate: new Date("2025-02-08").getTime(),
    emotionId: 1,
    content: "1번 일기",
  },
  {
    id: 2,
    createdDate: new Date("2025-02-07").getTime(),
    emotionId: 2,
    content: "2번 일기",
  },
  {
    id: 3,
    createdDate: new Date("2025-01-08").getTime(),
    emotionId: 4,
    content: "3번 일기",
  },
  {
    id: 4,
    createdDate: new Date("2025-01-07").getTime(),
    emotionId: 3,
    content: "4번 일기",
  },
];

function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return [action.data, ...state];
    case "UPDATE":
      return state.map((item) =>
        String(item.id) === String(action.data.id) ? action.data : item
      );
    case "DELETE":
      return state.filter((item) => String(item.id) !== String(action.id));
  }
}

export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();
function App() {
  const [data, dispatch] = useReducer(reducer, mockData);
  const idRef = useRef(3);

  // 새로운 일기 추가
  const onCreate = (createdDate, emotionId, content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  //일기 삭제
  const onDelete = (id) => {
    dispatch({
      type: "DELETE",
      id,
    });
  };

  // 일기 수정
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: "UPDATE",
      data: {
        id,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  return (
    <>
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext
          value={{
            onCreate,
            onUpdate,
            onDelete,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="diary/:id" element={<Diary />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DiaryDispatchContext>
      </DiaryStateContext.Provider>
    </>
  );
}

export default App;
