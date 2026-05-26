const randInt = (from: number, to: number) => {
    return Math.floor(from + Math.random() * (to - from))
}

export { randInt }