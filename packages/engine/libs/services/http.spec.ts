/* eslint-disable @typescript-eslint/no-var-requires */
import { http } from "./http";

jest.mock("bent", () =>
  jest.fn(() => () =>
    Promise.resolve({ text: () => Promise.resolve("content") })
  )
);

describe("sending http requests", () => {
  it("should return text as text", (done) => {
    require("bent").mockReturnValue(() =>
      Promise.resolve({ text: () => Promise.resolve("content") })
    );
    http({ method: "GET", url: "myUrl", body: {} }).subscribe(
      (response) =>
        expect(response).toEqual({
          request: { method: "GET", url: "myUrl", body: {} },
          body: "content",
        }),
      fail,
      () => done()
    );
  });

  it("should return json as json", (done) => {
    require("bent").mockReturnValue(() =>
      Promise.resolve({ text: () => Promise.resolve("[{}, 1]") })
    );
    http({ method: "GET", url: "myUrl", body: {} }).subscribe(
      (response) =>
        expect(response).toEqual({
          request: { method: "GET", url: "myUrl", body: {} },
          body: [{}, 1],
        }),
      fail,
      () => done()
    );
  });

  it("should return an error if body can not be read", (done) => {
    require("bent").mockReturnValue(() =>
      Promise.resolve({ text: () => Promise.reject("Body can not be read") })
    );
    http({ method: "GET", url: "myUrl", body: {} }).subscribe(fail, (err) => {
      expect(err).toEqual("Body can not be read");
      done();
    });
  });

  it("should return an error if the request fails", (done) => {
    require("bent").mockReturnValue(() => Promise.reject("Request failed"));
    http({ method: "GET", url: "myUrl", body: {} }).subscribe(fail, (err) => {
      expect(err).toEqual("Request failed");
      done();
    });
  });
});
