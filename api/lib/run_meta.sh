echo "Running the meta"

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

echo "HDFS HOST: $1"
echo "INPUT FILE: $2"
echo "OUTPUT FILE: $3"

echo "Fixing permission on pem file"
chmod 0400 api/lib/emr.pem

# DO NOT FORGET TO UNCOMMENT THIS!!!!
echo "Running the meta"
ssh -i api/lib/emr.pem hadoop@$1 spark-submit --master yarn  --deploy-mode client /home/hadoop/codebase/masterCode/marlabs-bi/bi/scripts/metadata.py --input "hdfs://$1:8020$2" --result "hdfs://$1:8020$3"
