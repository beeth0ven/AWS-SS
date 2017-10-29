import AWSService from './service/awsservice';

console.log('Ok Start...');

const service = new AWSService();

service.publicIp()
  .flatMap(service.stopEC2Instance)
  .flatMap(service.waitForStopped)
  .flatMap(service.startEC2Instance)
  .flatMap(service.waitForStarted)
  .map(service.dataToPublicIp)
  .flatMap(service.updateSSPublicIp)
  .subscribe(
    data => { console.log('Success with data:', data) },
    error => { console.error('Failed with error:',error) }
  );

