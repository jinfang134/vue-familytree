export default {
  'name': '张三',
  'value': 1,
  gender: 'm',
  'children': [{
      'name': '张三一',
      'value': 23,
      gender: 'male',
      'children': [{
          'name': '张四',
          'value': 104993,
          gender: 'f',
        },
        {
          'name': '张五',
          'value': 13033,
          gender: 'f',
          companion: [{
            name: '王五',
            gender: 'm'
          }]
        },
        {
          'name': '张六',
          'value': 24,
          'children': [{
              'name': '张六一',
              'value': 9354
            },
            {
              'name': '张六二',
              'value': 66
            },
            {
              'name': '张六三',
              'value': 767,
              'children': [{
                  'name': '张九一',
                  'value': 93541
                },
                {
                  'name': '张九二',
                  'value': 662
                },
                {
                  'name': '张九三',
                  'value': 7673
                }
              ]
            }
          ]
        },
        {
          'name': 'math',
          'value': 49
        }
      ]
    },
    {
      'name': '张三二',
      'value': 38,
      'children': [{
        'name': 'Visualization',
        'value': 16540
      }]
    }
  ]
}