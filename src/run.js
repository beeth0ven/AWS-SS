import AWSService from './service/awsservice';

console.log('Ok Start...');

AWSService.publicIp()
  .flatMap(AWSService.stopEC2Instance)
  .flatMap(AWSService.waitForStopped)
  .flatMap(AWSService.startEC2Instance)
  .flatMap(AWSService.waitForStarted)
  .map(AWSService.dataToPublicIp)
  .flatMap(AWSService.updateSSPublicIp)
  .subscribe(
    data => { console.log('Success with data:', data) },
    error => { console.error('Failed with error:',error) }
  );
