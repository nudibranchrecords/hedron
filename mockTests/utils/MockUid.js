export class MockUid {
  constructor (mocks = []) {
    this.mocks = {
      id: 0,
    }
    mocks.forEach(mockName => { this.mocks[mockName] = 0 })
    this.currentMockName = 'id'
  }

  getIdString () {
    return `${this.currentMockName}_${this.mocks[this.currentMockName]}`
  }

  getNewId () {
    this.mocks[this.currentMockName] += 1
    const id = this.getIdString()
    this.currentMockName = 'id'
    return id
  }

  resetMocks () {
    Object.keys(this.mocks).forEach(key => {
      this.mocks[key] = 0
    })
  }
}
