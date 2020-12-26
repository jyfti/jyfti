* jyfti install https://raw.githubusercontent.com/jyfti/jyfti/master/workflows/open-prs-to-slack.json 
* jyfti run
    * open-prs-to-slack
    * jyfti
    * example-repo
* jyfti view open-prs-to-slack | jq .steps[0]
* jyfti view open-prs-to-slack | jq .steps[1]
* jyfti view open-prs-to-slack | jq .steps[2]
* jyfti run
    * open-prs-to-slack
    * jyfti
    * exmapel-repo
* jyfti run state open-prs-to-slack | jq .inputs
* vi out/open-prs-to-slack.json
* jyfti run complete open-prs-to-slack
* jyfti run https://raw.githubusercontent.com/jyfti/jyfti/master/workflows/bitcoin-price.json