// / <reference types="cypress" />

context('PersonalInfo', () => {
  beforeEach(() => {
    cy.login('admin', 'admin')
    cy.intercept('/api/system/user/self*').as('userSelf')
    cy.get('.anticon-down > svg').click()
    cy.get('.ant-dropdown-menu > :nth-child(2)').click()
    cy.wait('@userSelf').then(() => {
    })
  })

  /* 正确更新数据 */
  it('update-personal-information 正确更新数据', function () {
    cy.get('.ant-space-item').prev().click()
    cy.get('.ant-upload>input').attachFile('OIP.jpeg')
    cy.get('input[placeholder="请输入用户真实姓名"]').clear().type('测试管理员')
    cy.get('input[placeholder="请输入用户名（昵称）"]').clear().type('管理员-test')
    cy.get('input[placeholder="请输入手机号"]').clear().type('17800000000')
    cy.get('input[placeholder="请输入电子邮箱"]').clear().type('17800000000@qq.com')
    cy.get('.ant-btn-primary').wait(400).click()
    cy.get('.ant-message').wait(300).should('have.text', '修改信息成功!')
    cy.get('.ant-upload>div img').should('have.class', 'avatar-img')
    cy.get('input[placeholder="请输入用户真实姓名"]').should('have.value', '测试管理员')
    cy.get('input[placeholder="请输入用户名（昵称）"]').should('have.value', '管理员-test')
    cy.get('input[placeholder="请输入手机号"]').should('have.value', '17800000000')
    cy.get('input[placeholder="请输入电子邮箱"]').should('have.value', '17800000000@qq.com')
  })

  /* 置空部分更新数据 */
  it('update-personal-information-empty 置空部分更新数据', function () {
    cy.get('.ant-space-item').prev().click()

    cy.get('.ant-upload>input').attachFile('OIP.jpeg')
    cy.get('input[placeholder="请输入手机号"]').clear().type('17800000000')
    cy.get('input[placeholder="请输入电子邮箱"]').clear().type('17800000000@qq.com')
    cy.get('.ant-btn-primary').wait(400).click()
    cy.get('.ant-message').wait(300).should('have.text', '校验未通过！')
    cy.get('.ant-upload>div img').should('have.class', 'avatar-img')
    cy.get('input[placeholder="请输入用户真实姓名"]').should('have.value', '')
    cy.get('input[placeholder="请输入用户名（昵称）"]').should('have.value', '')
    cy.get('input[placeholder="请输入用户真实姓名"]').parent().parent().parent().find('> div').wait(500).should('have.text', '请输入用户姓名')
    cy.get('input[placeholder="请输入用户名（昵称）"]').parent().parent().parent().find('> div').wait(500).should('have.text', '请输入用户名')
    cy.get('input[placeholder="请输入手机号"]').should('have.value', '17800000000')
    cy.get('input[placeholder="请输入电子邮箱"]').should('have.value', '17800000000@qq.com')
  })

  /* 非法更新数据 */
  it('update-personal-information-illegal 非法更新数据', function () {
    cy.get('.ant-space-item').prev().click()

    cy.get('.ant-upload>input').attachFile('OIP.jpeg')
    cy.get('input[placeholder="请输入用户真实姓名"]').clear().type('测试管理员')
    cy.get('input[placeholder="请输入用户名（昵称）"]').clear().type('管理员-test')
    cy.get('input[placeholder="请输入手机号"]').clear().type('abc')
    cy.get('input[placeholder="请输入电子邮箱"]').clear().type('abc')
    cy.get('.ant-btn-primary').wait(400).click()
    cy.get('.ant-message').wait(300).should('have.text', '校验未通过！')
    cy.get('.ant-upload>div img').should('have.class', 'avatar-img')
    cy.get('input[placeholder="请输入手机号"]').parent().parent().parent().find('> div').wait(500).should('have.text', '请输入以1开头的11位手机号码')
    cy.get('input[placeholder="请输入电子邮箱"]').parent().parent().parent().find('> div').wait(500).should('have.text', '请输入正确的邮箱')
    cy.get('input[placeholder="请输入用户真实姓名"]').should('have.value', '测试管理员')
    cy.get('input[placeholder="请输入用户名（昵称）"]').should('have.value', '管理员-test')
    cy.get('input[placeholder="请输入手机号"]').should('have.value', 'abc')
    cy.get('input[placeholder="请输入电子邮箱"]').should('have.value', 'abc')
  })
  /* 不保存直接更新数据 */
  it('update-personal-information-direct 不保存直接更新数据', function () {
    cy.get('.ant-btn-primary').wait(400).click()
    cy.get('.ant-message').wait(300).should('have.text', '修改信息成功!')
    cy.get('.ant-upload>div img').should('have.class', 'avatar-img')
    cy.get('input[placeholder="请输入用户真实姓名"]').should('have.value', '测试管理员')
    cy.get('input[placeholder="请输入用户名（昵称）"]').should('have.value', '管理员-test')
    cy.get('input[placeholder="请输入手机号"]').should('have.value', '17800000000')
    cy.get('input[placeholder="请输入电子邮箱"]').should('have.value', '17800000000@qq.com')
  })

  it('query-personal-infomation 查询个人信息', function () {
    cy.get('input[placeholder="请输入用户真实姓名"]').should('have.value', '测试管理员')
    cy.get('input[placeholder="请输入用户名（昵称）"]').should('have.value', '管理员-test')
    cy.get('input[placeholder="请输入手机号"]').should('have.value', '17800000000')
    cy.get('input[placeholder="请输入电子邮箱"]').should('have.value', '17800000000@qq.com')
  })

  /* 正确更新数据 */
  it('update-personal-information-backup 正确更新数据', function () {
    cy.get('.ant-space-item').prev().click()

    cy.get('.ant-upload>input').attachFile('OIP.jpeg')
    cy.get('input[placeholder="请输入用户真实姓名"]').clear().type('超级管理员')
    cy.get('input[placeholder="请输入用户名（昵称）"]').clear().type('管理员')
    cy.get('input[placeholder="请输入手机号"]').clear().type('17800000000')
    cy.get('input[placeholder="请输入电子邮箱"]').clear().type('17800000000@qq.com')
    cy.get('.ant-btn-primary').wait(400).click()
    cy.get('.ant-message').wait(300).should('have.text', '修改信息成功!')
    cy.get('.ant-upload>div img').should('have.class', 'avatar-img')
    cy.get('input[placeholder="请输入用户真实姓名"]').should('have.value', '超级管理员')
    cy.get('input[placeholder="请输入用户名（昵称）"]').should('have.value', '管理员')
    cy.get('input[placeholder="请输入手机号"]').should('have.value', '17800000000')
    cy.get('input[placeholder="请输入电子邮箱"]').should('have.value', '17800000000@qq.com')
  })
})
