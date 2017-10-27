const AWSService = require('./service/awsservice');
const minute = 60 * 1000;

console.log('Ok Start...');

AWSService.publicIp()
  .doOnNext(ip => console.log('old ip:', ip))
  .flatMap(AWSService.stopEC2Instance).delay(minute)
  .flatMap(AWSService.startEC2Instance).delay(0.5 * minute)
  .flatMap(AWSService.publicIp)
  .doOnNext(ip => console.log('new ip:', ip))
  .flatMap(AWSService.updateSSPublicIp)
  .subscribe(
    data => { console.log('Success!') },
    error => { console.error('Failed with error:',error) }
  );