#!/bin/bash
targetUrl="?????"
file_regions="regions_districts.txt"
file_rubrics="rubrics.txt"
currentDate=$(date +"%Y-%m-%d")
outputFileName="regions_vacancies_counts_$currentDate.txt"
declare -a rubricCodes

declare -i lineIndex=0
while read line || [[ -n "$line" ]]
do
	rubric=($line)
	rubricCodes[${lineIndex}]=${rubric[0]}
	lineIndex=$[$lineIndex+1]
done < $file_rubrics
rubrics_count=${#rubricCodes[@]}
echo "rubrics: ${rubricCodes[@]}"

function print_rubrics { # риймає один параметр: URL без параметра rubId
    echo $1
	
}

comaFlag=false
printf '%s' "[" > ${outputFileName}
while read line || [[ -n "$line" ]]
do
	region_districts=($line)
	regionCode=${region_districts[0]}
	
	declare countVacancies
	declare -i -r maxAttempt=5
	declare -i attempts=0
	
	while [ $attempts -lt $maxAttempt ]
	do
		responce=`curl --request GET "http://www.trud.gov.ua/searchDispVacRes?rubId=0&posId=&regId=${regionCode}&typeSearch=1"`
		countVacancies=$(sed -ne '/countVacancies/{s/.*<countVacancies>\(.*\)<\/countVacancies>.*/\1/p;q}' <<< "$responce")
  
		if [ -n "$countVacancies" ]
		then
			break
		else
			attempts=$[$attempts+1]
			echo "value for region $regionCode is not received on the ${attempts} attempt!"			
		fi		
	done
	
	if [ $comaFlag == true ]
	then
		#кома перед регіоном
		printf '%s' ", " >> ${outputFileName}
	else
		comaFlag=true
	fi
	printf '%s' "{\"code\": \"${regionCode}\", \"count\": \"${countVacancies}\"" >> ${outputFileName}
	
### region's rubrics block
	printf '%s' ", \"rubrics\": [" >> ${outputFileName}

	rubr_index=0

	while [ $rubr_index -lt $rubrics_count ]
	do   
		rubricCode=${rubricCodes[$rubr_index]}
		rubr_index=$[$rubr_index+1]
		
		countVacancies=""
		attempts=0
		
		while [ $attempts -lt $maxAttempt ]
		do
			responce=`curl --request GET "http://www.trud.gov.ua/searchDispVacRes?posId=0&regId=${regionCode}&typeSearch=1&rubId=${rubricCode}"`
			countVacancies=$(sed -ne '/countVacancies/{s/.*<countVacancies>\(.*\)<\/countVacancies>.*/\1/p;q}' <<< "$responce")
  
			if [ -n "$countVacancies" ]
			then
				break
			else
				attempts=$[$attempts+1]
				echo "value for rubric $rubricCode in region ${regionCode} is not received on the ${attempts} attempt!"			
			fi		
		done
	
		printf '%s' "{\"code\": \"${rubricCode}\", \"count\": \"${countVacancies}\"}" >> ${outputFileName}		
		
		if [ $rubr_index != $rubrics_count ]
		then
			#кома після рубрики
			printf '%s' "," >> ${outputFileName}
		fi
		
	done
	
	printf '%s' "]" >> ${outputFileName}
### end of region's rubrics block
	
	printf '%s' ", \"districts\": [" >> ${outputFileName}
	
	districts_count=${#region_districts[@]}
	index=1

	while [ $index -lt $districts_count ]
	do   
		districtCode=${region_districts[$index]}
		index=$[$index+1]
		
		countVacancies=""
		attempts=0
		
		while [ $attempts -lt $maxAttempt ]
		do
			responce=`curl --request GET "http://www.trud.gov.ua/searchDispVacRes?rubId=0&posId=&regId=${regionCode}&distrId=${districtCode}&typeSearch=2"`
			countVacancies=$(sed -ne '/countVacancies/{s/.*<countVacancies>\(.*\)<\/countVacancies>.*/\1/p;q}' <<< "$responce")
  
			if [ -n "$countVacancies" ]
			then
				break
			else
				attempts=$[$attempts+1]
				echo "value for district $districtCode is not received on the ${attempts} attempt!"			
			fi		
		done
	
		printf '%s' "{\"code\": \"${districtCode}\", \"count\": \"${countVacancies}\"" >> ${outputFileName}		
		
### district's rubrics block
		printf '%s' ", \"rubrics\": [" >> ${outputFileName}

		rubr_index=0

		while [ $rubr_index -lt $rubrics_count ]
		do   
			rubricCode=${rubricCodes[$rubr_index]}
			rubr_index=$[$rubr_index+1]
			
			countVacancies=""
			attempts=0
			
			while [ $attempts -lt $maxAttempt ]
			do
				responce=`curl --request GET "http://www.trud.gov.ua/searchDispVacRes?posId=0&regId=${regionCode}&distrId=${districtCode}&typeSearch=2rubId=${rubricCode}"`
				countVacancies=$(sed -ne '/countVacancies/{s/.*<countVacancies>\(.*\)<\/countVacancies>.*/\1/p;q}' <<< "$responce")
	  
				if [ -n "$countVacancies" ]
				then
					break
				else
					attempts=$[$attempts+1]
					echo "value for rubric $rubricCode in district ${districtCode} is not received on the ${attempts} attempt!"			
				fi		
			done
		
			printf '%s' "{\"code\": \"${rubricCode}\", \"count\": \"${countVacancies}\"}" >> ${outputFileName}		
			
			if [ $rubr_index != $rubrics_count ]
			then
				#кома після рубрики
				printf '%s' "," >> ${outputFileName}
			fi
			
		done
		
		printf '%s' "]" >> ${outputFileName}
### end of district's rubrics block
		
		printf '%s' "}" >> ${outputFileName}	
		
		
		if [ $index != $districts_count ]
		then
			#кома після району
			printf '%s' "," >> ${outputFileName}
		fi
		
	done
	
	printf '%s' "]}" >> ${outputFileName}
	
	
done < $file_regions
printf '%s' "]" >> ${outputFileName}


read -p "Type Enter to exit"

