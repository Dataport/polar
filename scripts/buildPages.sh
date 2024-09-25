array=( afm generic meldemichel snowbox textLocator )
for i in "${array[@]}"
do
  echo "Building $i docs ..."
	npm run docs:$i
  mkdir -p ./pages/docs/$i
  mv ./packages/clients/$i/docs/* ./pages/docs/$i
done
mkdir -p ./pages/node_modules/@polar/client-generic
mv ./node_modules/@polar/client-generic/* ./pages/node_modules/@polar/client-generic
echo "All docs built."
echo "GitHub page built."
