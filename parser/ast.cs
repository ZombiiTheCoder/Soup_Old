using System.Collections.Generic;

namespace ast
{

    public interface Statement{
        public string Kind();

    }


    public interface Program : Statement{
        public List<Statement> Body();

    }

    public interface Expression : Statement{}

    // Inheret Expression
    public interface BinaryExpression : Expression{
        public Expression Left();
        public Expression Right();
        public string Operator();
    }

    // Inheret Expression
    public interface Identifier : Expression{
        
        public string Symbol();

    }

    // Inheret Expression
    public interface NumericLiteral : Expression{
        public string Number();

    }
    

}