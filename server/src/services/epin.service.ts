export namespace EPinService {
  export const generateEPin = () => {
    const ePinLength: number = 11;
    var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return [...Array(ePinLength)].reduce(
      (a) => a + p[~~(Math.random() * p.length)],
      ""
    );
  };
}
