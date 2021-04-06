context('Log', () => {
  beforeEach(() => {
    cy.login('admin', 'admin')
  })

  it.skip('通用日志和接口日志', () => {
    cy.intercept('/api/system/log-usual/pagination*').as('logUsualPagination')
    cy.toModule('默认顶部', '系统监控', '通用日志', false)
    cy.wait('@logUsualPagination').then(() => {
    })
    cy.get('tbody.ant-table-tbody > tr').should('not.exist')

    cy.visit('/#/main/home')
    cy.intercept('/api/system/log-api/pagination*').as('logApiPagination')
    cy.toModule('默认顶部', '系统监控', '接口日志', false)
    cy.wait('@logApiPagination').then(() => {
    })
    cy.get('tbody.ant-table-tbody > tr').should('not.exist')

    cy.request('/api/test/testApi/testAdmin')
    cy.wait(1000)

    cy.intercept('/api/system/log-usual/pagination*').as('logUsualPagination')
    cy.visit('/#/monitor/log/usual')
    cy.get('button.ant-btn-primary')
      .contains('搜 索').parent().click()
    cy.wait('@logUsualPagination').then(() => {
    })

    cy.get('tbody.ant-table-tbody > tr').should('have.length', 1)
      .find('td').eq(4).should('have.text', 'info')
      .siblings().last().find('a').click()
    cy.get('#requestUri').should('have.value', '/test/testApi/testAdmin')
    cy.reload()

    cy.intercept('/api/system/log-api/pagination*').as('logApiPagination')
    cy.visit('/#/monitor/log/api')
    cy.get('button.ant-btn-primary')
      .contains('搜 索').parent().click()
    cy.wait('@logApiPagination').then(() => {
    })

    cy.get('tbody.ant-table-tbody > tr').should('have.length', 1)
      .find('td').last().find('a').click()
    cy.get('#title').should('have.value', '日志记录')
    cy.get('#method').should('have.value', 'GET')
    cy.get('#requestUri').should('have.value', '/test/testApi/testAdmin')
  })

  it('错误日志', () => {
    cy.intercept('/api/system/log-error/pagination*').as('logErrorPagination')
    cy.intercept('/api/test/testApi/testException').as('testException')

    cy.toModule('默认顶部', '系统监控', '错误日志', false)

    cy.wait('@logErrorPagination').then(() => {
    })

    cy.request({
      url: '/api/test/testApi/testException',
      failOnStatusCode: false
    })

    cy.wait(1000)

    cy.visit('/#/monitor/log/error')

    cy.intercept('/api/system/log-error/pagination*').as('logErrorPagination')
    cy.get('button.ant-btn-primary')
      .contains('搜 索').parent().click()
    cy.wait('@logErrorPagination').then(() => {
    })

    cy.get('tbody.ant-table-tbody > tr').should('have.length', 1)
      .find('td').eq(5).should('have.text', 'GET')
      .next().should('have.text', '/test/testApi/testException')
      .siblings().last().find('a').click()
    cy.get('input.ant-input-disabled').eq(5).should('have.value', 'GET')
    cy.get('input.ant-input-disabled').eq(6).should('have.value', '/test/testApi/testException')
  })
})
