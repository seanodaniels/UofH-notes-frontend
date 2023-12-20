Cypress.Commands.add('createNote', ({ content, important }) => {
  cy.request({
    url: `${Cypress.env('BACKEND')}/api/notes`,
    method: 'POST',
    body: { content, important },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  })

  cy.visit('')
})

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/api/login`, {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    cy.visit('')
  })
})

describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/api/testing/reset`)
    const user = {
      name: 'Sean ODaniels',
      username: 'sean',
      password: 'secret',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/api/users/`, user)
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

  it('login form can be opened', function() {
    cy.contains('log in').click()
  })

  it('user can login', function() {
    cy.get('#show-login').click()
    cy.get('#login-user').type('sean')
    cy.get('#login-password').type('secret')
    cy.get('#login-submit').click()
  })

  it('login fails with wrong password', function() {
    cy.get('#show-login').click()
    cy.get('#login-user').type('sean')
    cy.get('#login-password').type('lolwrong')
    cy.get('#login-submit').click()

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')

    cy.get('html').should('not.contain', 'Sean ODaniels logged in')
  })

  //
  // When logged in
  //
  describe('when logged in', function() {
    beforeEach(function() {
      cy.request('POST', `${Cypress.env('BACKEND')}/api/login`, {
        username: 'sean',
        password: 'secret',
      }).then(response => {
        localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
        cy.visit('')
      })
      // cy.get('#show-login').click()
      // cy.get('#login-user').type('sean')
      // cy.get('#login-password').type('secret')
      // cy.get('#login-submit').click()
      
    })

    describe('and several notes are created and exist', function() {
      beforeEach(function() {
        cy.login({ username: 'sean', password: 'secret' })
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })

      it('one of those can be made important', function() {
        cy.contains('second note').parent().find('.importance-toggle').click
        cy.contains('second note').parent().find('.importance-toggle')
          .should('contain', 'make important')
      })
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.createNote({
          content: 'another note cypress',
          important: true,
        })
        // cy.contains('create new note').click()
        // cy.get('input').type('another note cypress')
        // cy.contains('save').click()
      })

      it('it can be made not important', function () {
        cy.contains('another note cypress')
          .parent()
          .find('.importance-toggle') //.get would search the whole page again!
          .click
        cy.contains('another note cypress')
          .parent()
          .find('.importance-toggle')
          .should('contain', 'make not important')
      })
    })

  })
})