if(!process.env.HUSKY) process.exit(0)
const { default: husky } = await import('husky')
console.log(husky())
