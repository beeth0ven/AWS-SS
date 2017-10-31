import AWSService from './service/awsservice';
import Response from  './framwork/http/response';

module.exports.handler = (event, context, callback) => {

  console.log('Ok Start...');

  const service = new AWSService();
  const response = new Response();

  service.publicIp()
    .flatMap(service.stopEC2Instance)
    .flatMap(service.waitForStopped)
    .flatMap(service.startEC2Instance)
    .flatMap(service.waitForStarted)
    .map(service.dataToPublicIp)
    .flatMap(service.updateSSPublicIp)
    .subscribe(
      data => {
        console.log('Success with data:', data);
        callback(null, response.success(data));
      },
      error => {
        console.error('Failed with error:',error);
        callback(response.internalError(error));
      }
    );

};