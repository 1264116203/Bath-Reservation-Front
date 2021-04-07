context('User', () => {
  beforeEach(() => {
    cy.login('admin', 'admin')
    cy.intercept('/api/system/user/pagination*').as('userPagination')
    cy.intercept('/api/system/role/tree').as('roleTree')
    cy.intercept('/api/system/dept/tree').as('deptTree')
    cy.visit('/#/system/user')
    cy.wait(['@userPagination', '@roleTree', '@deptTree']).then(() => {
    })
  })

  it('user-create-01 正确新增用户信息', () => {
    cy.get('button').contains('添 加').parent().click()

    cy.get('div.ant-modal-content').find('input[placeholder="登录账号"]').type('testA')
    cy.get('input[placeholder="请输入用户姓名"]').type('张三A')
    cy.get('input[placeholder="请输入密码"]').type('pwd123456')
    cy.get('input[placeholder="请再次输入密码"]').type('pwd123456')
    cy.get('input[placeholder="请输入用户昵称"]').type('昵称A')
    cy.get('input[placeholder="请输入手机号"]').type('13012341234')
    cy.get('span.ant-select-search__field__placeholder').first().click()
    cy.get('div#rc-tree-select-list_1').find('li').contains('超级管理员').click()
    cy.get('span.ant-select-search__field__placeholder').last().click()
    cy.get('div#rc-tree-select-list_2').find('li').contains('开发1部').click()
    cy.get('div#rc-tree-select-list_2').find('li').contains('1部1组').click()
    cy.get('input[placeholder="请输入电子邮箱"]').click().type('testA@rcdcore.com')
    cy.intercept('/api/system/user/pagination*').as('userPagination')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait('@userPagination').then(() => {
    })
    //  操作完毕开始进行验证 验证第一行是否插入成功
    const firstTr = cy.get('tbody.ant-table-tbody').find('tr').first()

    firstTr.find('td').first()
      .next().should('have.text', 'testA')
      .next().should('have.text', '昵称A')
      .next().should('have.text', '张三A')
      .next().should('have.text', ' 超级管理员 ')
      .next().find('span.with-margin-bottom').contains(' 开发1部 ').should('be.exist')
      .siblings().first().should('have.text', ' 1部1组 ')
      .parent().parent()
      .next().should('have.text', '13012341234')
      //  验证详情框
      .next().find('a').first().click()

    cy.get('div.ant-modal-content').find('input').should('be.disabled')
    cy.get('div.ant-modal-content').find('span.ant-select')
      .should('have.class', 'ant-select-disabled')

    cy.get('div.ant-modal-content').find('input[placeholder="登录账号"]').should('be.disabled').should('have.value', 'testA')
    cy.get('input[placeholder="请输入用户姓名"]').should('have.value', '张三A')
    cy.get('input[placeholder="请输入用户昵称"]').should('have.value', '昵称A')
    cy.get('div.ant-modal-content').find('input').eq(3).should('have.value', '13012341234')
    cy.get('div.ant-modal-content').find('ul.ant-select-selection__rendered')
      .first().find('li').first().find('span.ant-select-selection__choice__content').last()
      .should('have.text', '超级管理员')
    cy.get('div.ant-modal-content').find('ul.ant-select-selection__rendered').last().find('li')
      .contains('开发1部').parent().siblings()
      .first().should('have.text', '1部1组')
  })

  it.skip('user-create-02 表单部分数据滞空', () => {
    cy.get('button').contains('添 加').parent().click()

    cy.get('div.ant-modal-content').find('input[placeholder="登录账号"]').type('testA')
    cy.get('input[placeholder="请输入密码"]').type('pwd123456')
    cy.get('input[placeholder="请输入用户昵称"]').type('昵称A')
    cy.get('input[placeholder="请输入手机号"]').type('13012341234')
    cy.get('span.ant-select-search__field__placeholder').first().click()
    cy.get('div#rc-tree-select-list_1').find('li').contains('超级管理员').click()
    cy.get('input[placeholder="请输入电子邮箱"]').click().type('testA@rcdcore.com')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    //  操作完毕开始进行验证
    cy.get('.ant-message').should('have.text', '校验失败！')

    cy.get('input[placeholder="请输入用户姓名"]').parent().parent()
      .should('have.text', '请输入用户姓名')

    cy.get('input[placeholder="请再次输入密码"]').parent().parent().parent()
      .should('have.text', '请再次输入密码')

    cy.get('span.ant-select-search__field__placeholder').last().parent().siblings()
      .should('have.text', '请选择所属部门')
  })

  it.skip('user-create-03 表单输入部分非法数据', () => {
    cy.get('button').contains('添 加').parent().click()

    cy.get('input[placeholder="请输入密码"]').type('pwd123456')
    cy.get('input[placeholder="请输入用户姓名"]').clear().type('张三AU')
    cy.get('input[placeholder="请输入用户昵称"]').type('昵称A')
    cy.get('input[placeholder="请输入用户姓名"]').type('张三ABCD')
    cy.get('input[placeholder="请再次输入密码"]').type('pwd12345')
    cy.get('input[placeholder="请输入手机号"]').type('987654321')
    cy.get('span.ant-select-search__field__placeholder').first().click()
    cy.get('div#rc-tree-select-list_1').find('li').contains('超级管理员').click()
    cy.get('span.ant-select-search__field__placeholder').last().click()
    cy.get('div#rc-tree-select-list_2').find('li').contains('1部1组').click()
    cy.get('input[placeholder="请输入电子邮箱"]').click().type('testA@.com')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()

    //  操作完毕开始进行验证
    cy.get('.ant-message').should('have.text', '校验失败！')

    cy.get('input[placeholder="请输入用户姓名"]').parent().parent()
      .should('have.text', '姓名长度在2到5个字符')
    cy.get('input[placeholder="请再次输入密码"]').parent().parent().parent()
      .should('have.text', '两次输入密码不一致!')
    cy.get('input[placeholder="请输入手机号"]').parent().parent()
      .should('have.text', '请输入以1开头的11位手机号码')
    cy.get('input[placeholder="请输入电子邮箱"]').parent().parent()
      .should('have.text', '请输入正确的邮箱')
  })

  it('user-update-01 正确修改用户信息', () => {
    cy.get('tbody.ant-table-tbody').find('tr').first()
      .find('td').last().find('a').contains('修改').click()

    cy.get('input[placeholder="请输入用户姓名"]').clear().type('张三AU')
    cy.get('input[placeholder="请输入用户昵称"]').clear().type('昵称A-update')
    cy.get('input[placeholder="请输入手机号"]').clear().type('13012345678')
    cy.get('span.ant-select-selection--multiple').first().click('left')
    cy.get('div#rc-tree-select-list_1').find('li').contains('超级管理员').click()
    cy.get('div#rc-tree-select-list_1').find('li').contains('用户').click()
    cy.get('span.ant-select-selection--multiple').last().click('left')
    cy.get('div#rc-tree-select-list_2').find('li').contains('开发1部').click()
    cy.get('input[placeholder="请输入电子邮箱"]').click().clear().type('testAUpdate@rcdcore.com')

    cy.intercept('/api/system/user/pagination*').as('userPagination')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait('@userPagination').then(() => {
    })

    //  验证第一行是否插入成功
    const firstTr = cy.get('tbody.ant-table-tbody').find('tr').first()

    firstTr.find('td').first()
      .next().should('have.text', 'testA')
      .next().should('have.text', '昵称A-update')
      .next().should('have.text', '张三AU')
      .next().should('have.text', ' 用户 ')
      .next().should('have.text', ' 1部1组 ')
      .next().should('have.text', '13012345678')

      //  验证详情框
      .next().find('a').first().click()

    cy.get('div.ant-modal-content').find('input[placeholder="登录账号"]').should('be.disabled').should('have.value', 'testA')
    cy.get('input[placeholder="请输入用户姓名"]').should('have.value', '张三AU')
    cy.get('input[placeholder="请输入用户昵称"]').should('have.value', '昵称A-update')
    cy.get('div.ant-modal-content').find('input').eq(3).should('have.value', '13012345678')

    cy.get('span.ant-select-selection--multiple').first().find('li.ant-select-selection__choice')
      .should('have.text', '用户')

    cy.get('span.ant-select-selection--multiple').last().find('li.ant-select-selection__choice')
      .should('have.text', '1部1组')

    cy.get('div.ant-modal-content').find('ul.ant-select-selection__rendered')
      .first().find('li').first().find('span.ant-select-selection__choice__content').last()
      .should('have.text', '用户')
    cy.get('div.ant-modal-content').find('ul.ant-select-selection__rendered')
      .last().find('li').first().find('span.ant-select-selection__choice__content').last()
      .should('have.text', '1部1组')

    cy.get('button.ant-modal-close').click()

    cy.wait(1000)
    cy.logout()
    cy.wait(1000)

    cy.login('testA', 'pwd123456')
    //  TODO 验证登录后
  })

  it.skip('user-update-02 修改用户信息时滞空部分数据', () => {
    cy.get('tbody.ant-table-tbody').find('tr').first()
      .find('td').last().find('a').contains('修改').click()

    cy.get('input[placeholder="请输入用户姓名"]').clear()

    cy.get('span.ant-select-search__field__placeholder').first().click('left')
    cy.get('div#rc-tree-select-list_1').find('li').contains('用户').click()

    cy.get('span.ant-select-search__field__placeholder').last().click('left')
    cy.get('div#rc-tree-select-list_2').find('li').contains('1部1组').click()

    cy.get('input[placeholder="请输入电子邮箱"]').click().clear()

    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()

    cy.wait(1000)
    //  操作完毕开始进行验证
    cy.get('.ant-message').should('have.text', '校验失败！')

    cy.get('input[placeholder="请输入用户姓名"]').parent().parent()
      .should('have.text', '请输入用户姓名')

    cy.get('span.ant-select-search__field__placeholder').first().parent().siblings()
      .should('have.text', '请选择所属角色')

    cy.get('span.ant-select-search__field__placeholder').last().parent().siblings()
      .should('have.text', '请选择所属部门')
  })

  it.skip('user-update-03 修改用户信息时部分数据改为非法数据', () => {
    // cy.url().should('eq', '/#/system/user')

    cy.get('tbody.ant-table-tbody').find('tr').first()
      .find('td').last().find('a').contains('修改').click()

    cy.get('input[placeholder="请输入用户姓名"]').clear().type('superman')

    cy.get('input[placeholder="请输入手机号"]').clear().type('987654321')

    cy.get('input[placeholder="请输入电子邮箱"]').clear().type('error-message.@.')

    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()

    cy.wait(1000)
    //  操作完毕开始进行验证
    cy.get('.ant-message').should('have.text', '校验失败！')

    cy.get('input[placeholder="请输入用户姓名"]').parent().parent()
      .should('have.text', '姓名长度在2到5个字符')

    cy.get('input[placeholder="请输入手机号"]').parent().parent()
      .should('have.text', '请输入以1开头的11位手机号码')

    cy.get('input[placeholder="请输入电子邮箱"]').parent().parent()
      .should('have.text', '请输入正确的邮箱')
  })

  it('user-select-01 输入条件进行列表查询', () => {
    cy.get('button.ant-btn-primary')
      .contains('搜 索').parent().click()

    cy.get('tbody.ant-table-tbody').find('tr')
      .should('have.length', 5)

    cy.get('input.ant-input').first().type('min')

    cy.get('input.ant-input').last().type('管理')

    cy.get('button.ant-btn-primary')
      .contains('搜 索').parent().click()

    const selectTr = cy.get('tbody.ant-table-tbody').find('tr')
    selectTr.should('have.length', 1)
    selectTr.first().find('td')
      .eq(1).should('have.text', 'admin')
      .next().should('have.text', '管理员')
      .next().should('have.text', '超级管理员')

    cy.get('button.ant-btn')
      .contains('清 空').parent().click()

    cy.get('input.ant-input').first().type('testadmin#@')

    cy.get('input.ant-input').last().type('超级class管理员')

    cy.get('button.ant-btn-primary')
      .contains('搜 索').parent().click()

    cy.get('tbody.ant-table-tbody').should('have.html', '')

    cy.get('p.ant-empty-description').should('have.text', '暂无数据')
  })

  it('user-create-04 添加待删除数据', () => {
    // cy.url().should('eq', '/#/system/user')

    cy.get('button').contains('添 加').parent().click()
    cy.get('div.ant-modal-content').find('input[placeholder="登录账号"]').type('testB')
    cy.get('input[placeholder="请输入用户姓名"]').type('张三B')
    cy.get('input[placeholder="请输入密码"]').type('pwd123456')
    cy.get('input[placeholder="请再次输入密码"]').type('pwd123456')
    cy.get('input[placeholder="请输入用户昵称"]').type('昵称B')
    cy.get('input[placeholder="请输入手机号"]').type('13012341234')
    cy.get('span.ant-select-search__field__placeholder').first().click()
    cy.get('div#rc-tree-select-list_1').find('li').contains('超级管理员').click()
    cy.get('span.ant-select-search__field__placeholder').last().click()
    cy.get('div#rc-tree-select-list_2').find('li').contains('技术研究室').click()
    cy.get('input[placeholder="请输入电子邮箱"]').click().type('testB@rcdcore.com')

    cy.intercept('/api/system/user/pagination*').as('userPagination')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait('@userPagination').then(() => {
    })

    cy.get('button').contains('添 加').parent().click()
    cy.get('div.ant-modal-content').find('input[placeholder="登录账号"]').type('testC')
    cy.get('input[placeholder="请输入用户姓名"]').type('张三C')
    cy.get('input[placeholder="请输入密码"]').type('pwd123456')
    cy.get('input[placeholder="请再次输入密码"]').type('pwd123456')
    cy.get('input[placeholder="请输入用户昵称"]').type('昵称C')
    cy.get('input[placeholder="请输入手机号"]').type('13012341234')
    cy.get('span.ant-select-search__field__placeholder').first().click()
    cy.get('div#rc-tree-select-list_1').find('li').contains('超级管理员').click()
    cy.get('span.ant-select-search__field__placeholder').last().click()
    cy.get('div#rc-tree-select-list_2').find('li').contains('技术研究室').click()
    cy.get('input[placeholder="请输入电子邮箱"]').click().type('testC@rcdcore.com')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait(4000)
  })

  it('user-resetPwd-01 正确进行用户密码重置', () => {
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('testA').parent().find('td').first()
      .find('input.ant-checkbox-input').click()

    cy.get('div.operation-btn-container').find('button').last().click()

    cy.get('div.ant-modal-content').find('input[type="password"]').clear().type('a123456')

    cy.get('div.ant-modal-footer').find('button.ant-btn-primary').click()

    cy.get('div.ant-message').should('have.text', '操作成功!')

    cy.logout()
    cy.login('testA', 'a123456')
  })

  it('user-resetPwd-01 用户密码重置输入非法数据', () => {
    // cy.url().should('eq', '/#/system/user')

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('testA').parent().find('td').first()
      .find('input.ant-checkbox-input').click()

    cy.get('div.operation-btn-container').find('button').last().click()

    cy.get('div.ant-modal-content').find('input[type="password"]').clear().type('123')

    cy.get('div.ant-modal-footer').find('button.ant-btn-primary').click()

    cy.get('div.ant-message').should('have.text', '校验失败！')

    cy.get('div.ant-modal-content').find('input[type="password"]').parent().parent().parent()
      .should('have.text', '必须有数字或者字母并且长度在4~16之间')
  })

  it('user-delete-01 进行单个删除', () => {
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('testA').parent().find('td').last()
      .find('a').contains('删除').click()
    cy.get('div.ant-popover-buttons').find('button').first().click()

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('testA').should('be.exist')

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('testA').parent().find('td').last()
      .find('a').contains('删除').click()
    cy.get('div.ant-popover-buttons').find('button').last().click()

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('testA').should('not.exist')
  })

  it('user-delete-02 进行批量删除', () => {
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('testB').parent().find('td').first()
      .find('input.ant-checkbox-input').click()

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('testC').parent().find('td').first()
      .find('input.ant-checkbox-input').click()

    cy.get('button.ant-btn-danger').click()

    cy.get('div.ant-modal-body').find('button').first().click()

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('testB').should('be.exist')

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('testC').should('be.exist')

    cy.get('button.ant-btn-danger').click()

    cy.get('div.ant-modal-body').find('button.ant-btn-danger').click()

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('testB').should('not.exist')

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('testC').should('not.exist')
  })

  it('user-delete-03 删除自身用户', () => {
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('admin').parent().find('td').last()
      .find('a').contains('删除').click()
    cy.get('div.ant-popover-buttons').find('button').last().click()

    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '不能删除账号自身!')

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('admin').should('be.exist')
  })
})
