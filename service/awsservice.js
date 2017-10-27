const { Observable } = require('rx');
const AWS = require('aws-sdk');
const config = require('./config');
AWS.config.update({region:'ap-northeast-2'});
const ec2 = new AWS.EC2();
const route53 = new AWS.Route53();
const ec2InstanceId = config.ec2InstanceId;

const ec2InstanceParams = { InstanceIds: [ec2InstanceId] };

class AWSService {

  static startEC2Instance() {
    console.log('AWSService startEC2Instance');
    const rxStartInstances = Observable.fromNodeCallback(ec2.startInstances.bind(ec2));
    return rxStartInstances(ec2InstanceParams);
  }

  static waitForStarted() {
    console.log('AWSService waitForStarted');
    return AWSService.waitFor('instanceRunning', ec2InstanceParams);
  }

  static stopEC2Instance() {
    console.log('AWSService stopEC2Instance');
    const rxStopInstances = Observable.fromNodeCallback(ec2.stopInstances.bind(ec2));
    return rxStopInstances(ec2InstanceParams);
  }

  static waitForStopped() {
    console.log('AWSService waitForStopped');
    return AWSService.waitFor('instanceStopped', ec2InstanceParams);
  }

  static waitFor(state, params) {
    const rxWaitFor = Observable.fromNodeCallback(ec2.waitFor.bind(ec2));
    return rxWaitFor(state, params);
  }

  static publicIp() {
    console.log('AWSService publicIp');
    const rxDescribeInstances = Observable.fromNodeCallback(ec2.describeInstances.bind(ec2));
    return rxDescribeInstances(ec2InstanceParams)
      .map(AWSService.dataToPublicIp)
  }

  static updateSSPublicIp(ip) {
    console.log('AWSService updateSSPublicIp');
    const params = {
      ChangeBatch: {
        Changes: [
          {
            Action: "UPSERT",
            ResourceRecordSet: {
              Name: "ss.beeth0ven.cf",
              ResourceRecords: [
                { Value: ip }
              ],
              TTL: 300,
              Type: "A"
            }
          }
        ],
        Comment: "Web server for ss.beeth0ven.cf"
      },
      HostedZoneId: "Z1SQZP97745SVF"
    };

    const rxChangeResourceRecordSets = Observable.fromNodeCallback(route53.changeResourceRecordSets.bind(route53));
    return rxChangeResourceRecordSets(params);
  }

  static dataToPublicIp(data) {
    const ip = data.Reservations[0].Instances[0].PublicIpAddress;
    console.log('Public Ip:', ip);
    return ip;
  }
}

module.exports = AWSService;
