import i18next from 'i18next'
import { makeStoreModule } from '../src/store'

describe('plugin-icon-menu', () => {
  describe('store', () => {
    describe('actions', () => {
      let actionContext
      let commit
      let dispatch
      let storeModule
      beforeEach(() => {
        commit = jest.fn()
        dispatch = jest.fn()
        storeModule = makeStoreModule()
        actionContext = {
          commit,
          dispatch,
          getters: {
            menus: [
              { id: 'draw', hint: 'Draw hint', plugin: Symbol('draw plugin') },
            ],
          },
          rootGetters: {},
        }
      })
      describe('openMenuById', () => {
        it('should open the menu with the given id if it is configured', () => {
          const openId = 'gfi'
          actionContext.getters.menus.push({ id: openId })
          storeModule.actions.openMenuById(actionContext, openId)

          expect(commit.mock.calls.length).toEqual(1)
          expect(commit.mock.calls[0][0]).toEqual('setOpen')
          expect(commit.mock.calls[0][1]).toEqual(1)
          expect(dispatch.mock.calls.length).toEqual(1)
          expect(dispatch.mock.calls[0][0]).toEqual('openInMoveHandle')
          expect(dispatch.mock.calls[0][1]).toEqual(1)
        })
        it('should do nothing if the menu with the given id is not configured', () => {
          storeModule.actions.openMenuById(actionContext, '')

          expect(commit.mock.calls.length).toEqual(0)
          expect(dispatch.mock.calls.length).toEqual(0)
        })
      })
      describe('openInMoveHandle', () => {
        it('should add the menu with the given index to the moveHandle if the client has the same size as the window and the width of the client is small', () => {
          i18next.init({
            lng: 'cimode',
            debug: false,
          })

          actionContext.rootGetters.hasWindowSize = true
          actionContext.rootGetters.hasSmallWidth = true
          storeModule.actions.openInMoveHandle(actionContext, 0)

          expect(commit.mock.calls.length).toEqual(1)
          expect(commit.mock.calls[0][0]).toEqual('setMoveHandle')
          const secondParameter = commit.mock.calls[0][1]
          expect(typeof secondParameter).toEqual('object')
          expect(secondParameter.closeLabel).toEqual(
            'plugins.iconMenu.mobileCloseButton'
          )
          expect(typeof secondParameter.closeFunction).toEqual('function')
          expect(secondParameter.component).toEqual(
            actionContext.getters.menus[0].plugin
          )
          expect(secondParameter.plugin).toEqual('iconMenu')

          expect(dispatch.mock.calls.length).toEqual(0)
        })
        it('should do nothing if the client either does not have the same size as the window or the width of the client is considered large', () => {
          storeModule.actions.openInMoveHandle(actionContext, 0)

          expect(commit.mock.calls.length).toEqual(0)
          expect(dispatch.mock.calls.length).toEqual(0)
        })
      })
    })
  })
})
