export default value => value && value.toString().replace(/[^0-9.]/g, '').slice(0, 5)
