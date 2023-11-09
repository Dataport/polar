import { updateMapInfo } from '../src/utils/lib'

describe('plugin-attributions', () => {
  const mockyButions = [
    {
      id: 'PLN',
      title:
        'Diese Attributions haben die Antwort, auf die wir alle gewartet haben. Oma Wetterwachs 42.',
    },
    {
      id: '1337',
      title:
        'Bei diesen Attributions kann nichts mehr schiefgehen. Polarkraftwerke 1337 <YEAR>.',
    },
    {
      id: 'nordlicht',
      title: 'Hier könnte Ihre Werbung stehen.',
    },
    {
      id: 'polarFuchs',
      title:
        'Unterhalten sich zwei Kerzen. Fragt die eine: "Ist Wind gefährlich?" Sagt die andere: "Davon kannst du ausgehen."',
    },
  ]

  describe('utils', () => {
    describe('lib', () => {
      // TODO: Copy and adjust these tests to be usable with buildMapInfo as well
      describe('updateMapInfo', () => {
        it('breaks the test', () => {
          expect(true).toBe(false)
        })

        it('should return no Attributions if none are found', () => {
          const mapInfo = updateMapInfo(['baz', 'foo'], mockyButions, [])

          expect(mapInfo.length).toBe(0)
        })

        it('should return configured attributions', () => {
          const mapInfo = updateMapInfo(['polarFuchs', 'foo'], mockyButions, [])

          expect(mapInfo.length).toBe(1)
          expect(mapInfo[0]).toBe(mockyButions[3].title)
        })

        it('should return polarFuchs/PLN Attributions', () => {
          const mapInfo = updateMapInfo(['polarFuchs', 'PLN'], mockyButions, [])

          expect(mapInfo.length).toBe(2)
          expect(mapInfo[0]).toBe(mockyButions[0].title)
          expect(mapInfo[1]).toBe(mockyButions[3].title)
        })
      })
    })
  })
})
