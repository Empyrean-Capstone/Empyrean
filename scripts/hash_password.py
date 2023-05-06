from passlib.hash import sha256_crypt
import sys

def main():
    print( sys.argv )
    if sys.argv[1] == '-h' or sys.argv[1] == '--help':
        print( 'This is a script to hash passwords for use in the spectrograph controle database' )
        print( 'The intended use is for when the database cannot be replaced, but also a user cannot be accessed' )
        print( 'This script will allow for a correct password to be returned to be put in the database' )
        print( 'Inteded usage: ' )
        print( 'python hash_password.py <password1> <password2> ... ' )
        print( 'python hash_password.py -h' )
    else:
        for password_index in range(1, len(sys.argv)):
            password = sys.argv[password_index]
            enc_pass = sha256_crypt.hash(password)
            print( f'{password}: {enc_pass}' )

if __name__ == "__main__":
    main()
