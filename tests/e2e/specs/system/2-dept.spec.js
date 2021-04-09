context('Dept', () => {
  beforeEach(() => {
    cy.login('admin', 'admin')
    cy.intercept('/api/system/dept/tree*').as('deptTree')
    cy.visit('/#/system/dept')
    cy.wait('@deptTree').then(() => {
    })
  })

  it('dept-create-01 正确新增组织机构信息', () => {
    cy.get('button').contains('添 加').parent().click()

    cy.get('input[placeholder="请输入组织机构名称"]').type('测试部门A')
    cy.get('input[placeholder="请输入组织机构全称"]').type('测试组织机构A')
    cy.get('input[placeholder="请输入组织机构类别"]').type('测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').type('test-dept-A')
    cy.get('input.ant-input-number-input').clear().type(1)
    cy.get('textarea[placeholder="请输入备注"]').type('测试备注123456789')

    cy.intercept('/api/system/dept/tree*').as('deptTree')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait('@deptTree').then(() => {
    })

    //  操作完毕开始进行验证
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门A').should('be.exist')
      .next().should('have.text', '测试组织机构A')
      .next().should('have.text', 'test-dept-A')
      .next().should('have.text', '测试类别')
      .next().find('a').contains('查看').click()

    cy.get('div.ant-modal-content').find('input').should('be.disabled')
    cy.get('div.ant-modal-content').find('textarea').should('be.disabled')
    cy.get('div.ant-modal-content').find('span.ant-select')
      .should('have.class', 'ant-select-disabled')

    cy.get('input[placeholder="请输入组织机构名称"]').should('have.value', '测试部门A')
    cy.get('input[placeholder="请输入组织机构全称"]').should('have.value', '测试组织机构A')
    cy.get('div.ant-modal-content').find('input').eq(2).should('have.value', '测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').should('have.value', 'test-dept-A')
    cy.get('input.ant-input-number-input').should('have.value', 1)
    cy.get('div.ant-modal-content').find('span.ant-select').should('have.text', '顶级组织机构')

    cy.get('button.ant-modal-close').click()
    cy.get('div.ant-tabs-tab').eq(1).contains(' 组织机构管理 ').siblings().first().click()

    cy.intercept('/api/system/dept/tree').as('deptTree')
    cy.intercept('/api/system/role/tree').as('roleTree')
    cy.intercept('/api/system/user/pagination*').as('userPagination')
    cy.visit('/#/system/user')
    cy.wait(['@deptTree', '@roleTree', '@userPagination']).then(() => {})

    cy.intercept('/api/system/user/*').as('userById')
    cy.get('tbody.ant-table-tbody').find('tr > td').contains('boss').siblings().last()
      .contains('修改').click()
    cy.wait('@userById').then(() => {})

    cy.get('span.ant-select-search__field__placeholder').last().parent().click('left')
    cy.get('div#rc-tree-select-list_3').find('li').contains('测试部门A').click()
    cy.get('span.ant-select-search__field__placeholder').last().parent().click('left')

    cy.intercept('/api/system/user/pagination*').as('userPagination')
    cy.get('div.ant-modal-footer').find('button.ant-btn-primary').click()
    cy.wait('@userPagination').then(() => {
    })

    cy.get('tbody.ant-table-tbody').find('tr > td').contains('boss').parent()
      .find('td').eq(5)
      .find('span.with-margin-bottom')
      .contains(' 开发1部 ').should('be.exist')
      .parent()
      .contains(' 测试部门A ').should('be.exist')
  })

  it('dept-create-02 新增组织机构，置空部分表单数据', () => {
    cy.get('button').contains('添 加').parent().click()
    cy.get('input[placeholder="请输入组织机构名称"]').type('测试部门B')
    cy.get('input.ant-input-number-input').clear()

    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()

    //  操作完毕开始进行验证
    cy.wait(200)

    cy.get('.ant-message').should('have.text', '校验未通过！')

    cy.get('input[placeholder="请输入组织机构全称"]').parent().parent()
      .should('have.text', '请输入组织机构全称')
    cy.get('input[placeholder="请输入组织机构编码"]').parent().parent()
      .should('have.text', '请输入组织机构编码')
    cy.get('div.ant-input-number').parent().parent()
      .should('have.text', '请输入排序')
  })

  it('dept-create-03 新增组织机构，输入非法数据', () => {
    cy.get('button').contains('添 加').parent().click()

    cy.get('input[placeholder="请输入组织机构名称"]').type('测试部门A1')
    cy.get('input[placeholder="请输入组织机构全称"]').type('测试组织机构A1')
    cy.get('input[placeholder="请输入组织机构类别"]').type('测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').type('12')

    cy.get('input.ant-input-number-input').clear().type('abc')
    cy.get('div.ant-input-number').parent().parent()
      .should('have.text', '请输入数字')
    cy.get('textarea[placeholder="请输入备注"]').type('测试备注123456789')

    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()

    //  操作完毕开始进行验证
    cy.wait(200)
    cy.get('.ant-message').should('have.text', '校验未通过！')

    cy.get('input[placeholder="请输入组织机构编码"]').parent().parent()
      .should('have.text', '只能是3-64个英文字符、数字或连字符')
    cy.get('div.ant-input-number').parent().parent()
      .should('have.text', '请输入排序')
  })

  it('dept-create-04 插入子部门', () => {
    cy.get('button').contains('添 加').parent().click()

    cy.get('input[placeholder="请输入组织机构名称"]').type('测试部门B')
    cy.get('input[placeholder="请输入组织机构全称"]').type('测试组织机构B')
    cy.get('input[placeholder="请输入组织机构类别"]').type('测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').type('test-dept-B')
    cy.get('span.ant-select-selection--single').click()
    cy.get('div#rc-tree-select-list_1').find('li').contains('测试部门A').click()
    cy.get('input.ant-input-number-input').clear().type(1)
    cy.get('textarea[placeholder="请输入备注"]').type('测试备注B123456789')

    cy.intercept('/api/system/dept/tree*').as('deptTree')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait('@deptTree').then(() => {
    })

    //  操作完毕开始进行验证

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门A').parent()
      .find('div.ant-table-row-collapsed').click()

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门B').should('be.exist')
      .next().should('have.text', '测试组织机构B')
      .next().should('have.text', 'test-dept-B')
      .next().should('have.text', '测试类别')
      .next().find('a').contains('查看').click()

    cy.get('div.ant-modal-content').find('input').should('be.disabled')
    cy.get('div.ant-modal-content').find('textarea').should('be.disabled')
    cy.get('div.ant-modal-content').find('span.ant-select')
      .should('have.class', 'ant-select-disabled')

    cy.get('input[placeholder="请输入组织机构名称"]').should('have.value', '测试部门B')
    cy.get('input[placeholder="请输入组织机构全称"]').should('have.value', '测试组织机构B')
    cy.get('div.ant-modal-content').find('input').eq(2).should('have.value', '测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').should('have.value', 'test-dept-B')
    cy.get('input.ant-input-number-input').should('have.value', 1)
    cy.get('div.ant-modal-content').find('span.ant-select').should('have.text', '测试部门A')

    cy.get('button.ant-modal-close').click()

    cy.get('button').contains('添 加').parent().click()

    cy.get('input[placeholder="请输入组织机构名称"]').type('测试部门C')
    cy.get('input[placeholder="请输入组织机构全称"]').type('测试组织机构C')
    cy.get('input[placeholder="请输入组织机构类别"]').type('测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').type('test-dept-C')
    cy.get('span.ant-select-selection--single').click()
    cy.get('div#rc-tree-select-list_1').find('li').contains('测试部门A').click()
    cy.get('input.ant-input-number-input').clear().type(1)
    cy.get('textarea[placeholder="请输入备注"]').type('测试备注B123456789')

    cy.intercept('/api/system/dept/tree*').as('deptTree')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait('@deptTree').then(() => {
    })
    //  操作完毕开始进行验证

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门C').should('be.exist')
      .next().should('have.text', '测试组织机构C')
      .next().should('have.text', 'test-dept-C')
      .next().should('have.text', '测试类别')
      .next().find('a').contains('查看').click()

    cy.get('div.ant-modal-content').find('input').should('be.disabled')
    cy.get('div.ant-modal-content').find('textarea').should('be.disabled')
    cy.get('div.ant-modal-content').find('span.ant-select')
      .should('have.class', 'ant-select-disabled')

    cy.get('input[placeholder="请输入组织机构名称"]').should('have.value', '测试部门C')
    cy.get('input[placeholder="请输入组织机构全称"]').should('have.value', '测试组织机构C')
    cy.get('div.ant-modal-content').find('input').eq(2).should('have.value', '测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').should('have.value', 'test-dept-C')
    cy.get('input.ant-input-number-input').should('have.value', 1)
    cy.get('div.ant-modal-content').find('span.ant-select').should('have.text', '测试部门A')

    cy.get('button.ant-modal-close').click()

    cy.visit('/#/main/home')

    cy.intercept('/api/system/user/pagination*').as('userPagination')
    cy.visit('/#/system/user')
    cy.wait('@userPagination').then(() => {
    })
    cy.get('button').contains('添 加').parent().click()
    cy.get('span.ant-select-search__field__placeholder').last().click()
    cy.get('div.ant-select-dropdown-content').find('li').contains('测试部门B').should('be.exist')
    cy.get('div.ant-select-dropdown-content').find('li').contains('测试部门C').should('be.exist')
  })

  it('dept-create-05 新增重复编码的数据', () => {
    cy.get('button').contains('添 加').parent().click()

    cy.get('input[placeholder="请输入组织机构名称"]').type('测试部门A')
    cy.get('input[placeholder="请输入组织机构全称"]').type('测试组织机构A')
    cy.get('input[placeholder="请输入组织机构类别"]').type('测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').type('test-dept-A')
    cy.get('input.ant-input-number-input').clear().type(1)
    cy.get('textarea[placeholder="请输入备注"]').type('测试备注123456789')

    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()

    //  操作完毕开始进行验证
    cy.wait(200)
    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '编码为test-dept-A的部门/岗位记录已经存在！')
  })

  it('dept-update-01 正确修改组织机构信息', () => {
    cy.intercept('/api/system/dept/* ').as('deptById')
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门A').siblings().last()
      .find('a').contains('修改').click()
    cy.wait('@deptById').then(() => {
    })

    cy.get('input[placeholder="请输入组织机构名称"]').type('-update')
    cy.get('input[placeholder="请输入组织机构全称"]').type('-update')
    cy.get('input[placeholder="请输入组织机构编码"]').type('-update')
    cy.get('input.ant-input-number-input').clear().type(2)
    cy.get('textarea[placeholder="请输入备注"]').clear().type('测试备注123456789-update')

    cy.intercept('/api/system/dept/tree*').as('deptTree')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait('@deptTree').then(() => {
    })

    //  操作完毕开始进行验证
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门A-update').should('be.exist')
      .next().should('have.text', '测试组织机构A-update')
      .next().should('have.text', 'test-dept-A-update')
      .next().should('have.text', '测试类别')
      .next().find('a').contains('查看').click()

    cy.get('div.ant-modal-content').find('input').should('be.disabled')
    cy.get('div.ant-modal-content').find('textarea').should('be.disabled')
    cy.get('div.ant-modal-content').find('span.ant-select')
      .should('have.class', 'ant-select-disabled')

    cy.get('input[placeholder="请输入组织机构名称"]').should('have.value', '测试部门A-update')
    cy.get('input[placeholder="请输入组织机构全称"]').should('have.value', '测试组织机构A-update')
    cy.get('div.ant-modal-content').find('input').eq(2).should('have.value', '测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').should('have.value', 'test-dept-A-update')
    cy.get('input.ant-input-number-input').should('have.value', 2)
    cy.get('div.ant-modal-content').find('span.ant-select').should('have.text', '顶级组织机构')
    cy.get('div.ant-modal-content').find('textarea').last().should('have.value', '测试备注123456789-update')

    cy.get('button.ant-modal-close').click()

    cy.get('div.ant-tabs-tab').contains(' 组织机构管理 ').siblings().first().click()

    cy.visit('/#/main/home')

    cy.intercept('/api/system/user/pagination*').as('userPagination')
    cy.visit('/#/system/user')
    cy.wait('@userPagination').then(() => {
    })

    cy.get('tbody.ant-table-tbody').find('tr > td').contains('boss').parent()
      .find('td').eq(5)
      .find('span.with-margin-bottom').contains(' 开发1部 ').should('be.exist')
      .siblings().first().should('have.text', ' 测试部门A-update ')
  })

  it('dept-update-02 修改不进行任何编辑直接保存', () => {
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门A').siblings().last()
      .find('a').contains('修改').click()

    cy.intercept('/api/system/dept/tree*').as('deptTree')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait('@deptTree').then(() => {
    })

    //  操作完毕开始进行验证
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门A-update').should('be.exist')
      .next().should('have.text', '测试组织机构A-update')
      .next().should('have.text', 'test-dept-A-update')
      .next().should('have.text', '测试类别')
      .next().find('a').contains('查看').click()

    cy.get('div.ant-modal-content').find('input').should('be.disabled')
    cy.get('div.ant-modal-content').find('textarea').should('be.disabled')
    cy.get('div.ant-modal-content').find('span.ant-select')
      .should('have.class', 'ant-select-disabled')

    cy.get('input[placeholder="请输入组织机构名称"]').should('have.value', '测试部门A-update')
    cy.get('input[placeholder="请输入组织机构全称"]').should('have.value', '测试组织机构A-update')
    cy.get('div.ant-modal-content').find('input').eq(2).should('have.value', '测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').should('have.value', 'test-dept-A-update')
    cy.get('input.ant-input-number-input').should('have.value', 2)
    cy.get('div.ant-modal-content').find('span.ant-select').should('have.text', '顶级组织机构')
    cy.get('div.ant-modal-content').find('textarea').last().should('have.value', '测试备注123456789-update')
  })

  it('dept-update-03 验证修改查重', () => {
    cy.intercept('/api/system/dept/* ').as('deptById')
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门A').siblings().last()
      .find('a').contains('修改').click()
    cy.wait('@deptById').then(() => {
    })

    cy.get('input[placeholder="请输入组织机构编码"]').clear().type('test-dept-B')

    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait(200)
    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '编码为test-dept-B的部门/岗位记录已经存在！')
  })

  it('dept-select-01 按照部门名称进行模糊查询', () => {
    cy.get('button.ant-btn-primary')
      .contains('搜 索').parent().click()
    cy.get('tbody.ant-table-tbody').find('tr')
      .should('have.length', 5)

    cy.get('input.ant-input').first().type('测试部门')
    cy.get('button.ant-btn-primary')
      .contains('搜 索').parent().click()
    cy.get('tbody.ant-table-tbody').find('tr')
      .should('have.length', 1)

    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .eq(1).find('div.ant-table-row-collapsed').click()

    cy.get('tbody.ant-table-tbody').find('tr')
      .should('have.length', 3)

    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .eq(1).should('have.text', '测试部门A-update')
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门B').should('be.exist')
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门C').should('be.exist')

    cy.get('button.ant-btn')
      .contains('清 空').parent().click()
    cy.get('input.ant-input').should('have.value', '')
    cy.get('input.ant-input').first().type('无此部门##')
    cy.get('button.ant-btn-primary')
      .contains('搜 索').parent().click()

    cy.get('tbody.ant-table-tbody').should('have.html', '')
    cy.get('p.ant-empty-description').should('have.text', '暂无数据')
  })

  it('dept-create-05 为删除新增测试数据', () => {
    cy.get('button').contains('添 加').parent().click()
    cy.get('input[placeholder="请输入组织机构名称"]').type('测试部门D')
    cy.get('input[placeholder="请输入组织机构全称"]').type('测试组织机构D')
    cy.get('input[placeholder="请输入组织机构类别"]').type('测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').type('test-dept-D')
    cy.get('input.ant-input-number-input').clear().type(1)
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()

    cy.get('button').contains('添 加').parent().click()
    cy.get('input[placeholder="请输入组织机构名称"]').type('测试部门E')
    cy.get('input[placeholder="请输入组织机构全称"]').type('测试组织机构E')
    cy.get('input[placeholder="请输入组织机构类别"]').type('测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').type('test-dept-E')
    cy.get('input.ant-input-number-input').clear().type(1)
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()

    cy.get('button').contains('添 加').parent().click()
    cy.get('input[placeholder="请输入组织机构名称"]').type('测试部门F')
    cy.get('input[placeholder="请输入组织机构全称"]').type('测试组织机构F')
    cy.get('input[placeholder="请输入组织机构类别"]').type('测试类别')
    cy.get('input[placeholder="请输入组织机构编码"]').type('test-dept-F')
    cy.get('input.ant-input-number-input').clear().type(1)
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
  })

  it('dept-delete-01 删除单个没有子节点的数据', () => {
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门D').siblings().last()
      .find('a').contains('删除').click()

    cy.get('div.ant-popover-buttons').find('button').first().click()

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门D').should('be.exist')
      .siblings().last()
      .find('a').contains('删除').click()

    cy.get('div.ant-popover-buttons').find('button').last().click().wait(500)

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门D').should('not.exist')
  })

  it('dept-delete-02 进行批量删除', () => {
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门A-update').parent()
      .find('div.ant-table-row-collapsed').click()
      .parent().parent().find('td').first()
      .find('input.ant-checkbox-input').click()

    cy.get('button.ant-btn-danger').click()
    cy.get('div.ant-modal-body').find('button').first().click()

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门A-update').should('be.exist')
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门B').should('be.exist')
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门C').should('be.exist')

    cy.get('button.ant-btn-danger').click()
    cy.get('div.ant-modal-body').find('button.ant-btn-danger').click()

    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '服务器内部错误。')

    cy.get('div.ant-modal-body').find('button').first().click()

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门A-update').should('be.exist')
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门B').should('be.exist')
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门C').should('be.exist')

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门A-update').siblings().first()
      .find('input.ant-checkbox-input').click()

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门E').siblings().first()
      .find('input.ant-checkbox-input').click()
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门F').siblings().first()
      .find('input.ant-checkbox-input').click()

    cy.get('button.ant-btn-danger').click()
    cy.get('div.ant-modal-body').find('button.ant-btn-danger').click()
    cy.get('.ant-message').should('have.text', '操作成功!')

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门E').should('not.exist')
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试部门F').should('not.exist')
  })
})
