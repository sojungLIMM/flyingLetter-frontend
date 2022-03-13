import { render, screen, waitFor } from "@testing-library/react";

import FriendList from "./FriendList";
import { getFriendList } from "../../api/axios";

jest.mock("react-router-dom");
jest.mock("../../api/axios", () => {
  const originalModule = jest.requireActual("../../api/axios");

  return {
    __esModule: true,
    ...originalModule,
    getFriendList: jest.fn(),
  };
});

describe("FriendList Component", () => {
  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();

    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  test("no registered friend", async () => {
    getFriendList.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            users: [],
          },
        },
      })
    );

    render(<FriendList />);

    await waitFor(() => {
      expect(screen.getByText("등록된 친구가 없습니다.")).toBeInTheDocument();
      expect(screen.queryAllByText("편지쓰기")).toHaveLength(0);
    });
  });

  test("have registered friend", async () => {
    getFriendList.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            users: [
              {
                _id: "123",
                country: "South Korea",
                nickname: "소정",
                language: "한국어",
                lat: 37.5565167,
                lng: 126.8591807,
                profileImage: "",
              },
            ],
          },
        },
      })
    );

    render(<FriendList />);

    await waitFor(() => {
      expect(screen.queryByText("등록된 친구가 없습니다.")).toBeNull();
      expect(screen.getAllByText("편지쓰기")).toHaveLength(1);
    });
  });

  test("render error message", async () => {
    getFriendList.mockImplementation(() =>
      Promise.reject({
        response: {
          data: {
            message: "오류 발생",
          },
        },
      })
    );

    render(<FriendList />);

    await waitFor(() => {
      expect(screen.getByText("오류 발생")).toBeInTheDocument();
    });
  });
});
