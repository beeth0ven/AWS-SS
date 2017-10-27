# stop ec2
aws ec2 stop-instances --instance-ids i-03ba17e3fc38cebf6
 	
# start ec2
aws ec2 start-instances --instance-ids i-03ba17e3fc38cebf6

# get ec2 public ip 
aws ec2 describe-instances --instance-id i-03ba17e3fc38cebf6 --query 'Reservations[*].Instances[*].[PublicIpAddress]'

# set domain to  ec2 public ip 
aws route53 change-resource-record-sets --hosted-zone-id Z1SQZP97745SVF --change-batch file://./changes.json