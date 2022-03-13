import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import { useSelector } from "react-redux";

import { render, screen, waitFor, fireEvent } from "../../utils/testUtils";
import NewLetter from "./NewLetter";
import { sendLetter } from "../../api/axios";

jest.mock("react-redux", () => {
  const originalModule = jest.requireActual("react-redux");

  return {
    __esModule: true,
    ...originalModule,
    useSelector: jest.fn(),
  };
});

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");

  return {
    __esModule: true,
    ...originalModule,
    useLocation: jest.fn(),
    useParams: jest.fn(),
  };
});

jest.mock("../../api/axios", () => {
  const originalModule = jest.requireActual("../../api/axios");

  return {
    __esModule: true,
    ...originalModule,
    sendLetter: jest.fn(),
  };
});

describe("NewLetter Component", () => {
  const newLetterComponent = (
    <BrowserRouter>
      <Routes>
        <Route path="/sendLetter/:userId" element={<NewLetter />} />
      </Routes>
    </BrowserRouter>
  );

  beforeEach(() => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          isLoggedIn: true,
          status: "",
          data: {
            _id: "123",
            country: "South Korea",
            nickname: "소정",
            language: "한국어",
            lat: 37.5565167,
            lng: 126.8591807,
            profileImage: "",
            email: "thwjd9897@gmail.com",
          },
        },
      })
    );
    window.history.pushState({}, "", "/sendLetter/:userId");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("render 편지를 현재 위치에 .. message if leave letter is true", async () => {
    useLocation.mockReturnValue({
      state: { leaveLetter: true, lat: 37, lng: 127 },
    });
    useParams.mockReturnValue({ userId: "123" });
    sendLetter.mockImplementation(() => Promise.resolve("ok"));

    render(newLetterComponent);

    fireEvent.click(screen.getByRole("button", { name: "편지 보내기" }));

    await waitFor(() => {
      expect(screen.getByText("편지를 현재 위치에 ..")).toBeInTheDocument();
    });
  });

  test("render 편지 배송을 시작합니다. message if have letterId", async () => {
    useLocation.mockReturnValue({
      state: {
        letterId: "2323",
        fromLat: 37,
        fromLng: 127,
        toLat: 34,
        toLng: 124,
      },
    });
    useParams.mockReturnValue({ userId: "123" });
    sendLetter.mockImplementation(() => Promise.resolve("ok"));

    render(newLetterComponent);

    fireEvent.click(screen.getByRole("button", { name: "편지 보내기" }));

    await waitFor(() => {
      expect(screen.getByText("편지 배송을 시작합니다.")).toBeInTheDocument();
    });
  });
});
