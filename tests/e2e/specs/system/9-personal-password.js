context('PersonalPassword', () => {
  beforeEach(() => {
    cy.login('admin', 'admin')
    cy.get('.anticon-down > svg').click()
    cy.get('.ant-dropdown-menu > :nth-child(2)').click()
    cy.get('.ant-card-body > .ant-tabs > .ant-tabs-bar > .ant-tabs-nav-container > .ant-tabs-nav-wrap > .ant-tabs-nav-scroll > .ant-tabs-nav > :nth-child(1) > [aria-selected="false"]').click()
  })

  /* 置空部分后更新密码 */
  it('update-password-empty 置空部分后更新密码', () => {
    cy.get('input[placeholder="请输入原密码"]').type('admin')
    cy.get('.ant-btn-primary').eq(1).click()

    cy.get('.ant-message').wait(300).should('have.text', '校验失败！')
    cy.get('input[placeholder="请输入原密码"]').should('have.value', 'admin')
    cy.get('input[placeholder="请输入密码"]').should('have.value', '')
    cy.get('input[placeholder="请再次输入密码"]').should('have.value', '')
  })

  /* 非法数据更新密码 */
  it('update-password-illegal 非法数据更新密码', () => {
    cy.get('input[placeholder="请输入原密码"]').type('admin')
    cy.get('input[placeholder="请输入密码"]').type('abc')
    cy.get('input[placeholder="请再次输入密码"]').type('abc')
    cy.get('.ant-btn-primary').eq(1).click()
    cy.get('.ant-message').wait(300).should('have.text', '校验失败！')
    cy.get('input[placeholder="请输入密码"]').parent().parent().parent().find('> div').wait(500).should('have.text', '以字母开头，长度在6~18之间')

    cy.get('input[placeholder="请输入原密码"]').should('have.value', 'admin')
    cy.get('input[placeholder="请输入密码"]').should('have.value', 'abc')
    cy.get('input[placeholder="请再次输入密码"]').should('have.value', 'abc')
  })

  /* 直接更新密码 */
  it('update-password-direct 直接更新密码', () => {
    cy.get('.ant-btn-primary').eq(1).click()
    cy.get('.ant-message').wait(300).should('have.text', '校验失败！')
    cy.get('input[placeholder="请输入密码"]').parent().parent().parent().find('> div').wait(500).should('have.text', '请输入密码')
    cy.get('input[placeholder="请再次输入密码"]').parent().parent().parent().find('> div').wait(500).should('have.text', '请再次输入密码')
    cy.get('input[placeholder="请输入原密码"]').should('have.value', '')
    cy.get('input[placeholder="请输入密码"]').should('have.value', '')
    cy.get('input[placeholder="请再次输入密码"]').should('have.value', '')
  })

  /* 查询个人密码数据 */
  it('query-password 查询个人密码数据', () => {
    cy.get('input[placeholder="请输入原密码"]').should('have.value', '')
    cy.get('input[placeholder="请输入密码"]').should('have.value', '')
    cy.get('input[placeholder="请再次输入密码"]').should('have.value', '')
  })

  /* 正确更新密码 */
  it('update-password 正确更新密码', () => {
    cy.get('input[placeholder="请输入原密码"]').type('admin')
    cy.get('input[placeholder="请输入密码"]').type('adminadmin')
    cy.get('input[placeholder="请再次输入密码"]').type('adminadmin')
    cy.get('.ant-btn-primary').eq(1).click()
    cy.get('.ant-message').wait(300).should('have.text', '修改密码成功!')
    cy.login('admin', 'adminadmin')
  })
})
