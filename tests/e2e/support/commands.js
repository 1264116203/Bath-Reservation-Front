// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import 'cypress-file-upload'

/* -- login command -- */
Cypress.Commands.add('login', (username, password) => {
  cy.intercept('/api/authenticate').as('authenticate')
  cy.intercept('/api/system/user/self').as('userSelf')
  cy.intercept('/api/system/top-menu/list/current-user').as('currentTopMenu')
  cy.intercept('/api/system/authority/menu-tree/current-user*').as('currentMenuTree')

  // 在无可用登录cookie条件下可访问登录页面
  cy.visit('/#/login')

  cy.get('input[type="text"]')
    .clear()
    .type(username)
  cy.get('input[type="password"]')
    .clear()
    .type(password)

  cy.get('button').click()

  Promise.all([
    cy.wait('@authenticate'),
    cy.wait('@userSelf'),
    cy.wait('@currentTopMenu'),
    cy.wait('@currentMenuTree')
  ]).then(() => {})
})

Cypress.Commands.add('logout', () => {
  cy.get('.avatar-dropdown')
    .click()

  cy.get('li.ant-dropdown-menu-item')
    .last()
    .click()
})

/**
 * 自动找到需要的功能模块
 */
Cypress.Commands.add('toModule', (topMenu, parentMenu, moduleMenu, openMenu) => {
  cy.intercept('/api/system/authority/menu-tree/current-user?topMenuId=*').as('currentMenuTreeByTopMenu')
  cy.get('ul.ant-menu-light')
    .find('li.ant-menu-item')
    .contains(topMenu).should('be.exist')
    .click()

  cy.wait('@currentMenuTreeByTopMenu').then(() => {
    if (openMenu) {
      cy.get('ul.ant-menu-dark')
        .find('li.ant-menu-submenu-inline')
        .find('div.ant-menu-submenu-title')
        .contains(parentMenu).should('be.exist')
        .click()
    }

    cy.get('ul.ant-menu-dark')
      .find('li.ant-menu-submenu-inline')
      .find('div.ant-menu-submenu-title')
      .contains(parentMenu)
      .parent().parent()
      .next().find('li')
      .contains(moduleMenu).should('be.exist')
      .click()
  })
})

/**
 * 自动找到需要的功能模块(无顶部菜单)
 */
Cypress.Commands.add('toModuleNoTopMenu', (parentMenu, moduleMenu, openMenu) => {
  const parentMenuDiv = cy.get('ul.ant-menu-dark')
    .find('li.ant-menu-submenu-inline')
    .find('div.ant-menu-submenu-title')
    .contains(parentMenu)

  if (openMenu) {
    parentMenuDiv.click()
  }

  parentMenuDiv
    .parent().parent()
    .next().find('li')
    .contains(moduleMenu)
    .click()
})
