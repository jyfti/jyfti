/* eslint-disable @typescript-eslint/no-var-requires */
import { http } from "./http";

jest.mock("bent", () =>
  jest.fn(() => () =>
    Promise.resolve({
      arrayBuffer: () => Promise.resolve(Buffer.from("content")),
    })
  )
);

describe("sending http requests", () => {
  it("should return the body as buffer", (done) => {
    require("bent").mockReturnValue(() =>
      Promise.resolve({
        arrayBuffer: () => Promise.resolve(Buffer.from("content")),
      })
    );
    http({ method: "GET", url: "myUrl", body: {} }).subscribe((response) => {
      expect(response).toHaveProperty("request", {
        method: "GET",
        url: "myUrl",
        body: {},
      });
      response.body.subscribe(
        (body) => expect(body).toEqual(Buffer.from("content")),
        fail,
        () => done()
      );
    }, fail);
  });

  it("should return an error if body can not be read", (done) => {
    require("bent").mockReturnValue(() =>
      Promise.resolve({
        arrayBuffer: () => Promise.reject("Body can not be read"),
      })
    );
    http({ method: "GET", url: "myUrl", body: {} }).subscribe((response) => {
      response.body.subscribe(fail, (err) => {
        expect(err).toEqual("Body can not be read");
        done();
      });
    }, fail);
  });

  it("should return an error if the request fails", (done) => {
    require("bent").mockReturnValue(() => Promise.reject("Request failed"));
    http({ method: "GET", url: "myUrl", body: {} }).subscribe(fail, (err) => {
      expect(err).toEqual("Request failed");
      done();
    });
  });
});
