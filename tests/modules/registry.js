const registry = require('../../modules/registry')
const fileio = require('../../modules/file-io')

let mockData = `
const React = require('react')

module.exports = props => (
  <button className='btn btn-default' onClick={props.onClick}>
    This is a test button!
  </button>
)
`

let mockDir = {
  'index.js': `
    const React = require('react')
    require('./section.css')

    const Section = props => (
      <section className='my-section'>
        <h1>{props.title}</h1>
        <p>{props.content}</p>
      </section>
    }
  `,
  'section.css': `
    .my-section {
      background: blue;
    }

    .my-section p {
      margin: 0;
    }
  `
}

let mockDeepDir = {
  'index.js': `
    const React = require('react')
    const analytics = require('./lib/analytics')
    require('./section.css')

    const Section = props => {
      analytics.track('opened-section-' + props.id)
      return (
        <section className='my-section'>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
        </section>
      )
    }
  `,
  'section.css': `
    .my-section {
      background: blue;
    }

    .my-section p {
      margin: 0;
    }
  `,
  'lib': {
    'analytics.js': `
      exports.track = function(event) {console.log('Tracking:', event, '...')}
    `
  }
}

async function main() {
  console.log(await registry.registerComponent('Button', mockData))
  console.log(await registry.registerComponent('Section', mockDir))
  console.log(await registry.registerComponent('TrackedSection', mockDeepDir))
  console.log(await fileio.loadComponent('505f108f8bf766816dd5f18b850924234a706066'))
  console.dir(await fileio.loadComponent('ddad29e0494ee18ebb17a53c73a17898e7225710'))
  console.dir(await fileio.loadComponent('7add9d95f2d81ccf177a74b7f30b1bc19d02a1e6'))
}

main()