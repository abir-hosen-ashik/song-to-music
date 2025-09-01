import argparse
from spleeter.separator import Separator

parser = argparse.ArgumentParser()
parser.add_argument("--input", required=True)
parser.add_argument("--output", required=True)
args = parser.parse_args()

separator = Separator('spleeter:2stems')
separator.separate_to_file(args.input, args.output)

print(args.output)
