const { Observable } = require('rx');
const AWS = require('aws-sdk');
AWS.config.update({region:'ap-northeast-2'});
const ec2 = new AWS.EC2();
const route53 = new AWS.Route53();
const ec2InstanceId = 'i-03ba17e3fc38cebf6';

class AWSService {

  static startEC2Instance() {
    console.log('AWSService startEC2Instance');
    const params = { InstanceIds: [ec2InstanceId] };
    const rxStartInstances = Observable.fromNodeCallback(ec2.startInstances.bind(ec2));
    return rxStartInstances(params);
  }

  static stopEC2Instance() {
    console.log('AWSService stopEC2Instance');
    const params = { InstanceIds: [ec2InstanceId] };
    const rxStopInstances = Observable.fromNodeCallback(ec2.stopInstances.bind(ec2));
    return rxStopInstances(params);
  }

  static publicIp() {
    console.log('AWSService publicIp');
    const params = { InstanceIds: [ec2InstanceId] };
    const rxDescribeInstances = Observable.fromNodeCallback(ec2.describeInstances.bind(ec2));
    return rxDescribeInstances(params)
      .map(data => data.Reservations[0].Instances[0].PublicIpAddress);
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
}

module.exports = AWSService;
